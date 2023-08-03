import Class from './Class';
import CourseInfoParser from './CourseInfoParser';

export default class Course {
	public cachedClasses?: Class[];
	public cachedName?: string;

	constructor(
		public sessionCode: string,
		public subject: string,
		public number: string
	) {}

	get code() {
		return `${this.subject} ${this.number}`;
	}

	private async fetchInfo() {
		const parser = new CourseInfoParser(this);

		this.cachedClasses = await parser.getClasses();
		this.cachedName = await parser.getName();
	}

	get classes() {
		if (this.cachedClasses) return this.cachedClasses;

		return this.fetchInfo().then(() => this.cachedClasses!);
	}

	get name() {
		if (this.cachedName) return this.cachedName;

		return this.fetchInfo().then(() => this.cachedName!);
	}
}
