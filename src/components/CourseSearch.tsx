import { useCallback, useEffect, useRef, useState } from 'react';
import Course from '../data/Course';
import './CourseSearch.css';
import Class from '../data/Class';
import ClassList from './ClassList';
import SearchResult from './SearchResult';
import OfferingsParser from '../data/OfferingsParser';
import NamedCourse from '../data/NamedCourse';

export default function CourseSearch({
	sessionCode,
	container,
	verticalRelativesContainer,
	scheduledClasses,
	onClassSelected,
	activeCourse,
	onCourseChanged
}: {
	sessionCode: string;
	container: HTMLElement | null;
	verticalRelativesContainer: HTMLElement | null;
	scheduledClasses: Class[];
	onClassSelected: (classInfo: Class) => void;
	activeCourse: Course | null;
	onCourseChanged: (course: Course | null) => void;
}) {
	const [query, setQuery] = useState<string>('');
	const [courses, setCourses] = useState<NamedCourse[]>([]);
	const [resultsMaxHeight, setResultsMaxHeight] = useState<string>();

	const calculateResultsMaxHeight = useCallback(() => {
		setResultsMaxHeight(
			`${
				container!.getBoundingClientRect().bottom -
				inputRef.current!.getBoundingClientRect().bottom -
				24 // Results element margin top and main padding bottom
			}px`
		);
	}, [container]);

	const inputRef = useRef<HTMLInputElement>(null);
	const resultRef = useRef<HTMLDivElement>(null);

	const shownCourses = !query
		? []
		: courses.filter(course =>
			course.code.startsWith(query.trim().toUpperCase())
		  );

	const hasResults = Boolean(activeCourse ?? shownCourses.length > 0);

	useEffect(
		() => void new OfferingsParser(sessionCode).getCourses().then(setCourses),
		[sessionCode, onCourseChanged]
	);

	useEffect(() => {
		if (!container || !verticalRelativesContainer) return;

		const resizeObserver = new ResizeObserver(calculateResultsMaxHeight);
		const mutationObserver = new MutationObserver(calculateResultsMaxHeight);

		resizeObserver.observe(container);
		mutationObserver.observe(verticalRelativesContainer, {
			childList: true,
			subtree: true
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [container, verticalRelativesContainer, calculateResultsMaxHeight]);

	useEffect(() => {
		const onWindowClick = (e: MouseEvent) => {
			if (
				!resultRef.current ||
				!hasResults ||
				e.composedPath().includes(resultRef.current) ||
				getComputedStyle(resultRef.current).position !== 'absolute'
			)
				return;

			setQuery('');
			onCourseChanged(null);
		};

		window.addEventListener('click', onWindowClick);

		return () => window.removeEventListener('click', onWindowClick);
	}, [hasResults, onCourseChanged]);

	return (
		<div className="class-search">
			<input
				ref={inputRef}
				className="search-input"
				placeholder="Search for courses"
				onInput={() => {
					setQuery(inputRef.current?.value ?? '');
					onCourseChanged(null);
				}}
			/>
			{hasResults && (
				<div className="search-results-container">
					<div
						ref={resultRef}
						className="search-results"
						style={{ maxHeight: resultsMaxHeight }}
					>
						{activeCourse ? (
							<ClassList
								course={activeCourse}
								scheduledClasses={scheduledClasses}
								onClassSelected={onClassSelected}
							/>
						) : (
							shownCourses.map(course => (
								<SearchResult
									key={course.code}
									onSelected={() => onCourseChanged(course)}
								>
									{course.code} {course.name}
								</SearchResult>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
