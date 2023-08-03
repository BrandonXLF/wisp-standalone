import Class from '../data/Class';
import './ScheduleGrid.css';
import ColumnCell from './ColumnCell';
import ScheduleSlot, { SlotType } from '../data/ScheduleSlot';
import GetStarted from './GetStarted';
import Course from '../data/Course';

type ScheduleSlotWithKey = ScheduleSlot & { key: string };

const COLUMN_DAYS = ['M', 'T', 'W', 'Th', 'F'] as const;
const COLUMN_LABELS: Record<(typeof COLUMN_DAYS)[number], string> = {
	M: 'Mon',
	T: 'Tue',
	W: 'Wed',
	Th: 'Thu',
	F: 'Fri'
};

function gridOnScroll(e: React.UIEvent) {
	const el = e.target as HTMLDivElement;

	el.classList.toggle('scrolled-x', !!el.scrollLeft);
	el.classList.toggle('scrolled-y', !!el.scrollTop);
}

function processClassOverlap(
	slots: ScheduleSlotWithKey[],
	i: number,
	slot: ScheduleSlotWithKey,
	prevSlot: ScheduleSlotWithKey
) {
	if (!('classSlots' in prevSlot) || !('classSlots' in slot))
		throw new Error('Slots must have classSlots');

	const prevSlotEnd = prevSlot.end;
	const overlapStart = slot.start;
	const overlapEnd = Math.min(prevSlot.end, slot.end);

	prevSlot.end = overlapStart;
	slot.start = overlapEnd;

	const newSlots = [...prevSlot.classSlots, ...slot.classSlots];

	slots.splice(i, 0, {
		type: SlotType.Class,
		start: overlapStart,
		end: overlapEnd,
		classSlots: newSlots,
		key: `${prevSlot.key}+${slot.key}`
	});

	i++;

	if (slot.end === overlapEnd) {
		slots.splice(i, 1);
		i--;
	}

	if (prevSlotEnd > overlapEnd) {
		let insertIndex = i + 1;

		while (slots[insertIndex]?.start < overlapEnd) insertIndex++;

		slots.splice(insertIndex, 0, {
			...prevSlot,
			start: overlapEnd,
			end: prevSlotEnd,
			key: `${prevSlot.key}/split`
		});

		if (insertIndex == i + 1) i++;
	}

	return i;
}

export default function ScheduleGrid({
	loading,
	classes,
	removeClass,
	courseClicked,
	mini
}: {
	loading: boolean;
	classes: Class[];
	removeClass: (classInfo: Class) => void;
	courseClicked: (course: Course) => void;
	mini?: boolean;
}) {
	const columns: ScheduleSlotWithKey[][] = COLUMN_DAYS.map(() => []);

	let hasClasses = false;

	classes.forEach(classInfo => {
		classInfo.slots.forEach((classSlot, i) => {
			classSlot.days.forEach((day, j) => {
				hasClasses = true;

				columns[COLUMN_DAYS.indexOf(day)].push({
					type: SlotType.Class,
					start: classSlot.start.index,
					end: classSlot.end.index,
					classSlots: [classSlot],
					key: `${classInfo.number}/${i}/${j}`
				});
			});
		});
	});

	if (!hasClasses) {
		columns[0].push({
			type: SlotType.Class,
			classType: 'GET_STARTED',
			start: 10 * 60,
			end: 11 * 60 - 10,
			content: <div>Your class here</div>,
			key: 'GET_STARTED_1'
		});

		columns[2].push({
			type: SlotType.Class,
			classType: 'GET_STARTED',
			start: 11 * 60,
			end: 12.5 * 60,
			content: <div>And another</div>,
			key: 'GET_STARTED_2'
		});

		columns[2].push({
			type: SlotType.Class,
			classType: 'GET_STARTED',
			start: 13 * 60,
			end: 14 * 60,
			content: <div>And one more here</div>,
			key: 'GET_STARTED_3'
		});
	}

	let start = Infinity;
	let end = 0;

	columns.forEach(slots => {
		slots.sort((a, b) => a.start - b.start);

		if (slots.length && slots[0].start < start) start = slots[0].start;

		let localEnd = 0;

		for (let i = 0; i < slots.length; i++) {
			const prevSlot = slots[i - 1] as (typeof slots)[0] | undefined;
			const slot = slots[i];

			if (slot.end > localEnd) localEnd = slot.end;

			if (!prevSlot) continue;

			if (prevSlot.end > slot.start) {
				i = processClassOverlap(slots, i, slot, prevSlot);
				continue;
			}

			slots.splice(i, 0, {
				type: SlotType.Gap,
				start: prevSlot.end,
				end: slot.start,
				content: (
					<div>
						{Math.floor((slot.start - prevSlot.end) / 60)}:
						{Math.floor((slot.start - prevSlot.end) % 60)}
					</div>
				),
				key: `${prevSlot.key}+${slot.key}`
			});

			i++;
		}

		if (localEnd > end) end = localEnd;
	});

	columns.forEach(slots => {
		if (!slots.length) {
			slots.push({
				type: SlotType.Blank,
				content: undefined,
				start: start,
				end: end,
				key: 'START'
			});

			return;
		}

		slots.unshift({
			type: SlotType.Blank,
			content: undefined,
			start: start,
			end: slots[0].start,
			key: 'START'
		});

		slots.push({
			type: SlotType.Blank,
			content: undefined,
			start: slots[slots.length - 1].end,
			end: end,
			key: 'END'
		});
	});

	const legendColumn: ScheduleSlot[] = [];

	for (let i = start, nextI = 0; i < end; i = nextI) {
		let hour = Math.floor(i / 60);
		const minutes = i % 60;

		if (hour > 12) hour -= 12;

		nextI = Math.ceil((i + 1) / 60) * 60;

		legendColumn.push({
			type: SlotType.Time,
			start: i,
			end: Math.min(nextI, end),
			content: <div>{`${hour}:${minutes.toString().padStart(2, '0')}`}</div>
		});
	}

	return (
		<div className="schedule-container">
			{!hasClasses && <GetStarted />}
			{loading && <div className="loading">Loading...</div>}
			<div className={`schedule${mini ? ' mini' : ''}`} onScroll={gridOnScroll}>
				<div className="columns">
					<div className="header"></div>
					{COLUMN_DAYS.map((day, i) => (
						<div
							key={day}
							className={`header${
								columns[i].length > 1 ? '' : ' header-empty-col'
							}`}
						>
							{COLUMN_LABELS[day]}
						</div>
					))}
					<div className="column time-column">
						{legendColumn.map(slot => (
							<ColumnCell key={slot.start} slot={slot} />
						))}
					</div>
					{columns.map((slots, i) => {
						return (
							<div key={i} className="column">
								{slots.map(slot => (
									<ColumnCell
										key={slot.key}
										slot={slot}
										removeClass={removeClass}
										courseClicked={courseClicked}
									/>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
