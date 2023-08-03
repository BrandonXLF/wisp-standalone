import Class from '../data/Class';
import ClassSubCell from './ClassSubCell';
import './ColumnCell.css';
import ScheduleSlot, { SlotType } from '../data/ScheduleSlot';
import Course from '../data/Course';
import { useMemo } from 'react';

export default function ColumnCell({
	slot,
	removeClass,
	courseClicked
}: {
	slot: ScheduleSlot;
	removeClass?: (classInfo: Class) => void;
	courseClicked?: (course: Course) => void;
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
			{'classSlots' in slot ? (
				<div className="slot-content">
					{slot.classSlots.map(classSlot => (
						<ClassSubCell
							key={classSlot.uniqueStr}
							classSlot={classSlot}
							onRemoved={() => removeClass?.(classSlot.classInfo)}
							courseClicked={() => courseClicked?.(classSlot.classInfo.course)}
							expandable={slot.classSlots.length > 1}
						/>
					))}
				</div>
			) : (
				slot.content
			)}
		</div>
	);
}
