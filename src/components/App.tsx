import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import ScheduleGrid from './ScheduleGrid';
import CourseSearch from './CourseSearch';
import Session from '../data/Session';
import Class from '../data/Class';
import Importer from '../data/Importer';
import QuestImporter from './QuestImporter';
import StoredClass from '../data/StoredClass';
import TopArea from './TopArea';
import Course from '../data/Course';
import Footer from './Footer';
import BorderlessButton from './BorderlessButton';
import ImportIcon from '../icons/ImportIcon';
import MaximizeIcon from '../icons/MaximizeIcon';
import MinimizeIcon from '../icons/MinimizeIcon';
import CloseIcon from '../icons/CloseIcon';

export default function App() {
	const [session, setSession] = useState(Session.getActive());
	const [loading, setLoading] = useState(true);
	const [classes, setClasses] = useState<Class[]>([]);
	const [activeCourse, setActiveCourse] = useState<Course | null>(null);

	const [miniMode, setMiniMode] = useState(false);
	const [showImporter, setShowImporter] = useState(false);
	const [darkMode, setDarkMode] = useState(!!localStorage.getItem('wisp-dark'));

	const addClass = useCallback((classInfo: Class) => {
		setClasses(existingClasses => {
			if (
				existingClasses.some(
					existingClass => existingClass.number == classInfo.number
				) ||
				classInfo.course.sessionCode !== sessionRef.current.code
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
	const importerRef = useRef(new Importer(session, addClass));
	const sessionRef = useRef(session);

	useEffect(() => {
		const storedClasses = JSON.parse(
			localStorage.getItem(`wisp-semester-${session}`) ?? '[]'
		) as StoredClass[];

		importerRef.current.setSession(session);
		sessionRef.current = session;

		setLoading(true);
		setClasses([]);
		setActiveCourse(null);

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

		const key = `wisp-semester-${sessionRef.current.code}`;

		if (!storedClasses.length) {
			localStorage.removeItem(key);
			return;
		}

		localStorage.setItem(key, JSON.stringify(storedClasses));
	}, [classes, loading]);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode);

		if (darkMode) localStorage.setItem('wisp-dark', '1');
		else localStorage.removeItem('wisp-dark');
	}, [darkMode]);

	return (
		<div id="container">
			<main ref={mainRef}>
				<header ref={headerRef}>
					<TopArea session={session} onSessionChanged={setSession} />
					<div className="main-buttons">
						<BorderlessButton onClick={() => setShowImporter(!showImporter)}>
							{showImporter ? <CloseIcon /> : <ImportIcon />}
						</BorderlessButton>
						<BorderlessButton onClick={() => setMiniMode(!miniMode)}>
							{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
						</BorderlessButton>
					</div>
					{showImporter && <QuestImporter importer={importerRef.current} />}
					<CourseSearch
						sessionCode={session.code}
						container={mainRef.current}
						verticalRelativesContainer={headerRef.current}
						scheduledClasses={classes}
						onClassSelected={addClass}
						activeCourse={activeCourse}
						onCourseChanged={setActiveCourse}
					/>
				</header>
				<ScheduleGrid
					loading={loading}
					classes={classes}
					onClassRemoved={removeClass}
					onCourseClicked={setActiveCourse}
					isMini={miniMode}
				/>
			</main>
			<Footer
				darkMode={darkMode}
				onDarkModeToggled={() => setDarkMode(!darkMode)}
			/>
		</div>
	);
}
