import Class from '../data/Class';
import ClassSubCell from './ClassSubCell';
import './ColumnCell.css';
import ScheduleSlot, { SlotType } from '../data/ScheduleSlot';
import Course from '../data/Course';
import { useMemo } from 'react';

export default function ColumnCell({
	slot,
	onClassRemoved,
	onCourseClicked
}: {
	slot: ScheduleSlot;
	onClassRemoved?: (classInfo: Class) => void;
	onCourseClicked?: (course: Course) => void;
}) {
	const className = useMemo(() => {
		if (slot.type !== SlotType.Class) return slot.type;

		let classType: string;

		if ('classType' in slot) classType = slot.classType;
		else
			classType = slot.classSlots.every(
				classSlot =>
					classSlot.classInfo.type == slot.classSlots[0].classInfo.type
			)
				? `${slot.classSlots[0].classInfo.type}`
				: 'MULTI';

		return `${slot.type} class-${classType}`;
	}, [slot]);

	if (slot.start === slot.end) return null;

	const height = ((slot.end - slot.start) / 10) * 1.75 + 'em';

	return (
		<div style={{ height }} className={`column-slot ${className}`}>
			<div className="cell-content">
				{'classSlots' in slot
					? slot.classSlots.map(classSlot => (
						<ClassSubCell
							key={classSlot.uniqueStr}
							classSlot={classSlot}
							onRemoved={() => onClassRemoved?.(classSlot.classInfo)}
							onCourseClicked={() =>
								onCourseClicked?.(classSlot.classInfo.course)
							}
							expandable={slot.classSlots.length > 1}
						/>
					  ))
					: slot.content}
			</div>
		</div>
	);
}
