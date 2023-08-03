import Course from './Course';

export default class NamedCourse extends Course {
	constructor(
		public sessionCode: string,
		public subject: string,
		public number: string,
		public _name: string
	) {
		super(sessionCode, subject, number);

		this.cachedName = _name;
	}

	get name() {
		return this.cachedName!;
	}
}
