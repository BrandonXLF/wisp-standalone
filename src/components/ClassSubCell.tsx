import { useState } from 'react';
import './ClassSubCell.css';
import ClassSlot from '../data/ClassSlot';
import InstructorLink from './InstructorLink';
import CloseIcon from '../icons/CloseIcon';
import CollapseIcon from '../icons/CollapseIcon';
import ExpandIcon from '../icons/ExpandIncon';
import BorderlessButton from './BorderlessButton';

export default function ClassSubCell({
	classSlot,
	onRemoved,
	onCourseClicked,
	expandable
}: {
	classSlot: ClassSlot;
	onRemoved: () => void;
	onCourseClicked: () => void;
	expandable?: boolean;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<div className="slot-top">
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
