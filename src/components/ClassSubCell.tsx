import { useMemo, useState } from 'react';
import './ClassSubCell.css';
import ClassSlot from '../data/ClassSlot';
import InstructorLink from './InstructorLink';
import CloseIcon from '../icons/CloseIcon';
import CollapseIcon from '../icons/CollapseIcon';
import ExpandIcon from '../icons/ExpandIcon';
import BorderlessButton from './BorderlessButton';
import OverlapIcon from '../icons/OverlapIcon';

export default function ClassSubCell({
	classSlot,
	onRemoved,
	onCourseClicked,
	expandable,
	siblings = []
}: {
	classSlot: ClassSlot;
	onRemoved: () => void;
	onCourseClicked: () => void;
	expandable?: boolean;
	siblings?: ClassSlot[];
}) {
	const [expanded, setExpanded] = useState(false);

	const overlaps = useMemo(
		() =>
			siblings.some(
				sibling =>
					classSlot !== sibling &&
					classSlot.endDate >= sibling.startDate &&
					classSlot.startDate <= sibling.endDate
			),
		[classSlot, siblings]
	);

	return (
		<>
			<div className="slot-top">
				{overlaps && (
					<>
						<OverlapIcon />{' '}
					</>
				)}
				<a
					href=""
					className="course-code"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						onCourseClicked();
					}}
				>
					{classSlot.classInfo.course.code}
				</a>{' '}
				<span>{classSlot.classInfo.section}</span>{' '}
				<span>{classSlot.classInfo.number}</span>
				{expandable && (
					<>
						{' '}
						<BorderlessButton onClick={() => setExpanded(!expanded)}>
							{expanded ? <CollapseIcon /> : <ExpandIcon />}
						</BorderlessButton>
					</>
				)}{' '}
				<BorderlessButton onClick={onRemoved}>
					<CloseIcon />
				</BorderlessButton>
			</div>
			{(!expandable || expanded) && (
				<div className="expanded-content">
					<div>
						<span>{classSlot.room}</span>{' '}
						<InstructorLink classInfo={classSlot.classInfo} />{' '}
						<span>{classSlot.classInfo.enrolledString}</span>
					</div>
					<div>
						<span>{classSlot.timeStr}</span> <span>{classSlot.dateStr}</span>
					</div>
				</div>
			)}
		</>
	);
}
