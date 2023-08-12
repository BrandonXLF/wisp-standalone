import { useEffect, useRef, useState } from 'react';
import './App.css';
import ScheduleGrid from './ScheduleGrid';
import CourseSearch from './CourseSearch';
import Session from '../data/Session';
import QuestImporter from './QuestImporter';
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
import useConfigBoolean from '../helpers/UseConfigBoolean';
import useClassList from '../helpers/UseClassList';
import useClassListStore from '../helpers/UseClassListStore';
import IndexSelector from './IndexSelector';
import CloneIcon from '../icons/CloneIcon';

export default function App() {
	const [session, setSession] = useState(Session.getCurrent());

	const [
		classLists,
		ensureEmptyClassList,
		addClassList,
		selectClassList,
		updateSelectedClassList,
		removeSelectedClassList
	] = useClassListStore(session);

	const [
		selectedClasses,
		classListStatus,
		classImporter,
		addClass,
		removeClass
	] = useClassList(classLists.selected, updateSelectedClassList, session);

	const [importerShown, setImporterShown] = useState(false);
	const [miniMode, setMiniMode] = useConfigBoolean('wisp-mini');
	const [darkMode, setDarkMode] = useConfigBoolean('wisp-dark');

	const mainElement = useRef<HTMLElement>(null);
	const header = useRef<HTMLElement>(null);

	const [activeCourse, setActiveCourse] = useState<Course | null>(null);
	useEffect(() => setActiveCourse(null), [session]);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
	}, [darkMode]);

	return (
		<div id="container">
			<main ref={mainElement}>
				<header ref={header}>
					<TopArea session={session} onSessionChanged={setSession} />
					<div className="main-buttons">
						<IndexSelector
							items={classLists}
							selectedIndex={classLists.selectedIndex}
							setSelectedIndex={selectClassList}
						/>
						<BorderlessButton onClick={() => addClassList()}>
							<AddIcon />
						</BorderlessButton>
						<BorderlessButton onClick={() => addClassList(true)}>
							<CloneIcon />
						</BorderlessButton>
						<BorderlessButton onClick={() => setImporterShown(!importerShown)}>
							{importerShown ? <CloseIcon /> : <ImportIcon />}
						</BorderlessButton>
						<span>|</span>
						<BorderlessButton onClick={() => setMiniMode(!miniMode)}>
							{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
						</BorderlessButton>
						<BorderlessButton onClick={removeSelectedClassList}>
							<DeleteIcon />
						</BorderlessButton>
					</div>
					{importerShown && (
						<QuestImporter
							importer={classImporter.current}
							onEmptyClassListRequired={ensureEmptyClassList}
						/>
					)}
					<CourseSearch
						sessionCode={session.code}
						container={mainElement.current}
						verticalRelativesContainer={header.current}
						scheduledClasses={selectedClasses}
						onClassSelected={addClass}
						activeCourse={activeCourse}
						onCourseChanged={setActiveCourse}
					/>
				</header>
				<ScheduleGrid
					status={classListStatus}
					classes={selectedClasses}
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
