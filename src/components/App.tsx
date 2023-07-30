import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import ScheduleGrid from './ScheduleGrid';
import CourseSearch from './CourseSearch';
import Session from '../data/Semester';
import Class from '../data/Class';
import Importer from '../data/Importer';
import ImportButton from './ImportButton';
import StoredClass from '../data/StoredClass';
import TopArea from './TopArea';
import Course from '../data/Course';
import Footer from './Footer';

export default function App() {
	const [session, setSession] = useState<Session>(Session.getActive());
	const [loading, setLoading] = useState(true);
	const [classes, setClasses] = useState<Class[]>([]);
	const [activeCourse, setActiveCourse] = useState<Course | null>(null);

	const addClass = useCallback((classInfo: Class) => {
		setClasses(existingClasses => {
			if (
				existingClasses.some(
					existingClass => existingClass.number == classInfo.number
				)
			)
				return existingClasses;

			return [...existingClasses, classInfo];
		});
	}, []);

	const removeClass = useCallback((classInfo: Class) => {
		setClasses(existingClasses =>
			existingClasses.filter(
				existingClass => classInfo.number !== existingClass.number
			)
		);
	}, []);

	const mainRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLElement>(null);
	const importerRef = useRef<Importer>(new Importer(session, addClass));

	useEffect(() => {
		const storedClasses = JSON.parse(
			localStorage.getItem(`uw-scheduler-${session}`) ?? '[]'
		) as StoredClass[];

		importerRef.current.setSession(session);

		setLoading(true);
		setClasses([]);

		importerRef.current
			.importFromArray(storedClasses)
			.then(() => setLoading(false));
	}, [session]);

	useEffect(() => {
		if (loading) return;

		const storedClasses: StoredClass[] = classes.map(classInfo => {
			return [
				classInfo.course.subject,
				classInfo.course.number,
				classInfo.number
			];
		});

		localStorage.setItem(
			`uw-scheduler-${session}`,
			JSON.stringify(storedClasses)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [classes, loading]);

	return (
		<div id="container">
			<main ref={mainRef}>
				<header ref={headerRef}>
					<TopArea session={session} onSessionChanged={setSession} />
					<ImportButton importer={importerRef.current} />
					<CourseSearch
						sessionCode={session.code}
						container={mainRef.current}
						verticalRelativesContainer={headerRef.current}
						scheduledClasses={classes}
						addScheduledClass={addClass}
						activeCourse={activeCourse}
						setActiveCourse={setActiveCourse}
					/>
				</header>
				<ScheduleGrid
					loading={loading}
					classes={classes}
					removeClass={removeClass}
					courseClicked={setActiveCourse}
				/>
			</main>
			<Footer />
		</div>
	);
}
