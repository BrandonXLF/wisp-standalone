import Class from '../data/Class';
import './ScheduleGrid.css';
import ColumnCell from './ColumnCell';
import GetStarted from './GetStarted';
import Course from '../data/Course';
import { useMemo } from 'react';
import Schedule from '../data/Schedule';

function gridOnScroll(e: React.UIEvent) {
	const el = e.target as HTMLDivElement;

	el.classList.toggle('scrolled-x', !!el.scrollLeft);
	el.classList.toggle('scrolled-y', !!el.scrollTop);
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
	const [columns, timeColumn, hasClassSlots] = useMemo(() => {
		const schedule = new Schedule(classes);

		return [
			schedule.prepareColumns(),
			schedule.prepareTimeColumn(),
			schedule.hasClassSlots
		];
	}, [classes]);

	return (
		<div className="schedule-container">
			{!hasClassSlots && <GetStarted />}
			{loading && <div className="loading">Loading...</div>}
			<div className={`schedule${mini ? ' mini' : ''}`} onScroll={gridOnScroll}>
				<div className="columns">
					<div className="header"></div>
					{Schedule.days.map((day, i) => (
						<div
							key={day}
							className={`header${
								columns[i].length > 1 ? '' : ' header-empty-col'
							}`}
						>
							{Schedule.dayLabels[day]}
						</div>
					))}
					<div className="column time-column">
						{timeColumn.map(slot => (
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
