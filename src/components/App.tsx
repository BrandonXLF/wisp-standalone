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
import AddIcon from '../icons/AddIcon';
import DeleteIcon from '../icons/DeleteIcon';
import ArrayWithSelected from '../data/ArrayWithSelected';

export default function App() {
	const [session, setSession] = useState(Session.getActive());
	const [classLists, setClassLists] = useState(
		new ArrayWithSelected<StoredClass[]>([[]], 0)
	);
	const [loading, setLoading] = useState(true);
	const [classes, setClasses] = useState<Class[]>([]);
	const [activeCourse, setActiveCourse] = useState<Course | null>(null);

	const [miniMode, setMiniMode] = useState(false);
	const [showImporter, setShowImporter] = useState(false);
	const [darkMode, setDarkMode] = useState(!!localStorage.getItem('wisp-dark'));

	const ensureEmptyClassList = useCallback(() => {
		setClassLists(schedules => {
			if (!schedules.selected.length) return schedules;

			if (schedules.last.length)
				return new ArrayWithSelected([...schedules, []]);

			return new ArrayWithSelected(schedules);
		});
	}, []);

	const deleteCurrentClassList = useCallback(() => {
		setClassLists(schedules => {
			schedules = schedules.clone();

			schedules.splice(schedules.selectedIndex, 1);

			if (schedules.selectedIndex === schedules.length)
				schedules.selectedIndex--;

			if (!schedules.length) {
				schedules.push([]);
				schedules.selectedIndex = 0;
			}

			return schedules;
		});
	}, []);

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
		importerRef.current.setSession(session);
		sessionRef.current = session;

		setLoading(true);

		const [storedClassArray = [], selectedIndex = 0]: [
			StoredClass[][],
			number
		] = JSON.parse(localStorage.getItem(`wisp-semester-${session}`) ?? '[]');

		if (!storedClassArray.length) storedClassArray.push([]);

		setClassLists(new ArrayWithSelected(storedClassArray, selectedIndex));
	}, [session]);

	useEffect(() => {
		if (loading) return;

		localStorage.setItem(
			`wisp-semester-${sessionRef.current.code}`,
			JSON.stringify(classLists)
		);
	}, [loading, classLists]);

	useEffect(() => {
		setLoading(true);
		setClasses([]);
		setActiveCourse(null);

		importerRef.current
			.importFromArray(classLists.selected)
			.then(() => setLoading(false));
	}, [classLists.selected]);

	useEffect(() => {
		if (loading) return;

		setClassLists(schedules => {
			schedules = schedules.clone();

			schedules.selected.splice(0, schedules.selected.length);

			classes.forEach(classInfo => {
				schedules.selected.push([
					classInfo.course.subject,
					classInfo.course.number,
					classInfo.number
				]);
			});

			return schedules;
		});
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
						{classLists.map((_, i) => {
							return (
								<BorderlessButton
									key={i}
									onClick={() =>
										setClassLists(
											classLists => new ArrayWithSelected(classLists, i)
										)
									}
									className={
										i === classLists.selectedIndex ? 'selected-button' : ''
									}
								>
									{i + 1}
								</BorderlessButton>
							);
						})}
						<BorderlessButton
							onClick={() =>
								setClassLists(
									classLists => new ArrayWithSelected([...classLists, []])
								)
							}
						>
							<AddIcon />
						</BorderlessButton>
						<BorderlessButton onClick={() => setShowImporter(!showImporter)}>
							{showImporter ? <CloseIcon /> : <ImportIcon />}
						</BorderlessButton>
						<span>|</span>
						<BorderlessButton onClick={() => setMiniMode(!miniMode)}>
							{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
						</BorderlessButton>
						<BorderlessButton onClick={deleteCurrentClassList}>
							<DeleteIcon />
						</BorderlessButton>
					</div>
					{showImporter && (
						<QuestImporter
							importer={importerRef.current}
							onEmptyClassListRequired={ensureEmptyClassList}
						/>
					)}
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
