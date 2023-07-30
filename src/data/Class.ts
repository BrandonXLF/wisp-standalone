import ClassSlot from './ClassSlot';
import Course from './Course';

export default class Class {
	constructor(
		public course: Course,
		public number: string,
		public type: string,
		public sectionNumber: string,
		public campus: string,
		public enrolled: number,
		public capacity: number,
		private instructorRaw: string,
		public slots: ClassSlot[] = []
	) {}

	public get section() {
		return `${this.type} ${this.sectionNumber}`;
	}

	private get instructorParts() {
		return this.instructorRaw.split(',', 2);
	}

	public get instructorLast() {
		return this.instructorParts[0] || '';
	}

	public get instructorFull() {
		return `${this.instructorParts[1] || ''} ${this.instructorParts[0] || ''}`;
	}

	public get instructorLink() {
		return `/professor/${this.instructorFull
			.toLowerCase()
			.replace(/ /g, '_')
			.replace(/[^a-z_]/g, '')}`;
	}

	public get enrolledString() {
		return `${this.enrolled}/${this.capacity}`;
	}
}
