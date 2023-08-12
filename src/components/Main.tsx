import { useEffect, useRef, useState } from 'react';
import './Main.css';
import ScheduleGrid from './ScheduleGrid';
import CourseSearch from './CourseSearch';
import Session from '../data/Session';
import QuestImporter from './QuestImporter';
import TopArea from './TopArea';
import Course from '../data/Course';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import useClassList from '../helpers/UseClassList';
import useClassListStore from '../helpers/UseClassListStore';
import ScheduleActions from './ScheduleActions';

export default function Main() {
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

	const mainElement = useRef<HTMLElement>(null);
	const header = useRef<HTMLElement>(null);

	const [activeCourse, setActiveCourse] = useState<Course | null>(null);
	useEffect(() => setActiveCourse(null), [session]);

	return (
		<main ref={mainElement}>
			<header ref={header}>
				<TopArea session={session} onSessionChanged={setSession} />
				<ScheduleActions
					classLists={classLists}
					onClassListSelected={selectClassList}
					onClassListAdded={addClassList}
					onSelectedClassListRemoved={removeSelectedClassList}
					importerShown={importerShown}
					onImporterShownChanged={setImporterShown}
					miniMode={miniMode}
					onMiniModeChanged={setMiniMode}
				/>
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
	);
}
