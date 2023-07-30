import Class from '../data/Class';
import './ClassListItem.css';
import InstructorLink from './InstructorLink';
import SearchResult from './SearchResult';

const listFormatter = new Intl.ListFormat('en');

export default function ClassListItem({
	classInfo,
	scheduledClasses,
	onSelected
}: {
	classInfo: Class;
	scheduledClasses: Class[];
	onSelected: () => void;
}) {
	const isAdded = scheduledClasses.some(
		scheduledClass => scheduledClass.number === classInfo.number
	);
	const isFull = classInfo.enrolled >= classInfo.capacity;
	const overlaps = scheduledClasses
		.filter(scheduledClass => scheduledClass.number !== classInfo.number)
		.filter(scheduledClass =>
			scheduledClass.slots.some(slot =>
				classInfo.slots.some(
					proposedSlot =>
						proposedSlot.days.some(day => slot.days.includes(day)) &&
						proposedSlot.endDate >= slot.endDate &&
						proposedSlot.startDate <= slot.startDate &&
						proposedSlot.end >= slot.start &&
						proposedSlot.start <= slot.end
				)
			)
		);

	return (
		<SearchResult
			className={`${isAdded ? 'result-added' : ''} ${
				overlaps.length ? 'result-overlaps' : ''
			} ${isFull ? 'results-full' : ''}`}
			key={classInfo.number}
			onChosen={onSelected}
		>
			<div>
				<div>
					{isAdded && <span>Added!</span>} {isFull && <span>Full!</span>}{' '}
					{!!overlaps.length && (
						<span>
							Overlaps with{' '}
							{listFormatter.format(
								overlaps.map(
									overlap => `${overlap.course.code} ${overlap.section}`
								)
							)}
							.
						</span>
					)}
				</div>
				<div>
					<strong>{classInfo.section}</strong> <span>{classInfo.number}</span> (
					<span>{classInfo.enrolledString}</span>
					) <InstructorLink classInfo={classInfo} />
				</div>
				{classInfo.slots.map(dateTime => (
					<div key={dateTime.uniqueStr}>
						<span>{dateTime.timeStr}</span> <span>{dateTime.dayStr}</span>{' '}
						<span>{dateTime.dateStr}</span> <span>{dateTime.room}</span>
					</div>
				))}
			</div>
		</SearchResult>
	);
}
