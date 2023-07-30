import Class from '../data/Class';
import ClassSubCell from './ClassSubCell';
import './ColumnCell.css';
import ScheduleSlot from '../data/ScheduleSlot';
import Course from '../data/Course';

export default function ColumnCell({
	slot,
	removeClass,
	courseClicked
}: {
	slot: ScheduleSlot;
	removeClass?: (classInfo: Class) => void;
	courseClicked?: (course: Course) => void;
}) {
	if (slot.start === slot.end) return null;

	const height = ((slot.end - slot.start) / 10) * 1.75 + 'em';

	return (
		<div style={{ height }} className={`column-slot ${slot.className ?? ''}`}>
			{slot.classSlots ? (
				<div className={slot.className}>
					{slot.classSlots.map(classSlot => (
						<ClassSubCell
							key={classSlot.uniqueStr}
							classSlot={classSlot}
							onRemoved={() => removeClass?.(classSlot.classInfo)}
							courseClicked={() => courseClicked?.(classSlot.classInfo.course)}
							expandable={slot.classSlots!.length > 1}
						/>
					))}
				</div>
			) : (
				slot.content
			)}
		</div>
	);
}
