import { Day } from '../components/ScheduleGrid';
import Class from './Class';
import ClassDate from './ClassDate';
import ClassTime from './ClassTime';

export default class ClassSlot {
	private static DATE_TIME_PATTERN =
		/([0-9:]+)-([0-9:]+)([A-Za-z]+)([^-]*|)-?(.*|)/;

	static newFromStrings(classInfo: Class, dateTimeStr: string, room: string) {
		if (!ClassSlot.DATE_TIME_PATTERN.test(dateTimeStr)) return false;

		const [, startStr, endStr, daysStr, startDateStr, endDateStr] =
			ClassSlot.DATE_TIME_PATTERN.exec(dateTimeStr)!;

		const start = new ClassTime(startStr);
		const end = new ClassTime(endStr, start.index >= 12 * 60);
		const startDate = new ClassDate(startDateStr);
		const endDate = new ClassDate(endDateStr, true);
		const days = daysStr.split(/(?=[A-Z])/) as Day[];

		return new ClassSlot(classInfo, start, end, startDate, endDate, days, room);
	}

	constructor(
		public classInfo: Class,
		public start: ClassTime,
		public end: ClassTime,
		public startDate: ClassDate,
		public endDate: ClassDate,
		public days: Day[],
		public room: string
	) {}

	get timeStr() {
		return `${this.start}\u2013${this.end}`;
	}

	get dayStr() {
		return this.days.join('');
	}

	get dateStr() {
		if (!this.startDate.isDefined()) return '';

		if (this.startDate.valueOf() === this.endDate.valueOf())
			return this.startDate.toString();

		return `${this.startDate}\u2013${this.endDate}`;
	}

	get uniqueStr() {
		return `${this.timeStr}${this.dayStr}${this.dateStr}${this.room}`;
	}
}
