import './ScheduleActions.css';
import ArrayWithSelected from '../data/ArrayWithSelected';
import StoredClass from '../data/StoredClass';
import AddIcon from '../icons/AddIcon';
import CloneIcon from '../icons/CloneIcon';
import CloseIcon from '../icons/CloseIcon';
import DeleteIcon from '../icons/DeleteIcon';
import ImportIcon from '../icons/ImportIcon';
import MaximizeIcon from '../icons/MaximizeIcon';
import MinimizeIcon from '../icons/MinimizeIcon';
import BorderlessButton from './BorderlessButton';
import IndexSelector from './IndexSelector';

export default function ScheduleActions({
	classLists,
	onClassListSelected,
	onClassListAdded,
	onSelectedClassListRemoved,
	importerShown,
	onImporterShownChanged,
	miniMode,
	onMiniModeChanged
}: {
	classLists: ArrayWithSelected<StoredClass[]>;
	onClassListSelected: (index: number) => void;
	onClassListAdded: (clone?: boolean) => void;
	onSelectedClassListRemoved: () => void;
	importerShown: boolean;
	onImporterShownChanged: (shown: boolean) => void;
	miniMode: boolean;
	onMiniModeChanged: (miniMode: boolean) => void;
}) {
	return (
		<div className="schedule-actions-container">
			<div className="schedule-actions">
				<IndexSelector
					items={classLists}
					selectedIndex={classLists.selectedIndex}
					onIndexSelected={onClassListSelected}
				/>
				<BorderlessButton onClick={() => onClassListAdded()}>
					<AddIcon />
				</BorderlessButton>
				<BorderlessButton onClick={() => onClassListAdded(true)}>
					<CloneIcon />
				</BorderlessButton>
				<BorderlessButton
					onClick={() => onImporterShownChanged(!importerShown)}
				>
					{importerShown ? <CloseIcon /> : <ImportIcon />}
				</BorderlessButton>
				<span>|</span>
				<BorderlessButton onClick={() => onMiniModeChanged(!miniMode)}>
					{miniMode ? <MaximizeIcon /> : <MinimizeIcon />}
				</BorderlessButton>
				<BorderlessButton onClick={onSelectedClassListRemoved}>
					<DeleteIcon />
				</BorderlessButton>
			</div>
		</div>
	);
}
