import { useCallback, useEffect, useRef, useState } from 'react';
import Course from '../data/Course';
import './CourseSearch.css';
import Class from '../data/Class';
import ClassList from './ClassList';
import SearchResult from './SearchResult';

export default function CourseSearch({
	sessionCode,
	container,
	verticalRelativesContainer,
	scheduledClasses,
	addScheduledClass,
	activeCourse,
	setActiveCourse
}: {
	sessionCode: string;
	container: HTMLElement | null;
	verticalRelativesContainer: HTMLElement | null;
	scheduledClasses: Class[];
	addScheduledClass: (classInfo: Class) => void;
	activeCourse: Course | null;
	setActiveCourse: (course: Course | null) => void;
}) {
	const [query, setQuery] = useState<string>('');
	const [courses, setCourses] = useState<Course[]>([]);
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

	useEffect(() => {
		setActiveCourse(null);
		Course.getAll(sessionCode).then(setCourses);
	}, [sessionCode, setActiveCourse]);

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
			setActiveCourse(null);
		};

		window.addEventListener('click', onWindowClick);

		return () => window.removeEventListener('click', onWindowClick);
	}, [hasResults, setActiveCourse]);

	return (
		<div className="class-search">
			<input
				ref={inputRef}
				className="search-input"
				placeholder="Search for courses"
				onInput={() => {
					setQuery(inputRef.current?.value ?? '');
					setActiveCourse(null);
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
								addScheduledClass={addScheduledClass}
							/>
						) : (
							shownCourses.map(course => (
								<SearchResult
									key={course.code}
									onChosen={() => setActiveCourse(course)}
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
