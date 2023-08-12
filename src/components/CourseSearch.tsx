import { useEffect, useRef, useState } from 'react';
import Course from '../data/Course';
import './CourseSearch.css';
import Class from '../data/Class';
import ClassList from './ClassList';
import SearchResult from './SearchResult';
import OfferingsParser from '../data/OfferingsParser';
import NamedCourse from '../data/NamedCourse';
import useRemainingHeight from '../helpers/UseRemainingHeight';

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
	const [hadError, setHadError] = useState(false);
	const [courses, setCourses] = useState<NamedCourse[]>([]);
	const input = useRef<HTMLInputElement>(null);
	const resultElement = useRef<HTMLDivElement>(null);

	const resultsMaxHeight = useRemainingHeight({
		container,
		prevSibling: input.current,
		verticalRelativesContainer,
		offset: 24 // Results element margin top and main padding bottom
	});

	const shownCourses = !query
		? []
		: courses.filter(course =>
			course.code.startsWith(query.trim().toUpperCase())
		  );

	const hasResults = Boolean(activeCourse ?? shownCourses.length > 0);

	useEffect(
		() =>
			void (async () => {
				try {
					setCourses(await new OfferingsParser(sessionCode).getCourses());
				} catch {
					setHadError(true);
				}
			})(),
		[sessionCode, onCourseChanged]
	);

	useEffect(() => {
		const onWindowClick = (e: MouseEvent) => {
			if (
				!resultElement.current ||
				!hasResults ||
				e.composedPath().includes(resultElement.current) ||
				getComputedStyle(resultElement.current).position !== 'absolute'
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
				ref={input}
				className="search-input"
				placeholder="Search for courses"
				onInput={() => {
					setQuery(input.current?.value ?? '');
					onCourseChanged(null);
				}}
			/>
			{hadError && <div className="search-error">Error loading offerings.</div>}
			{hasResults && (
				<div className="search-results-container">
					<div
						ref={resultElement}
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
