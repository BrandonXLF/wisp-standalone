import Class from './Class';
import CourseInfoParser from './CourseInfoParser';

export default class Course {
	public classes?: Class[];

	constructor(
		public sessionCode: string,
		public subject: string,
		public number: string,
		public name: string = ''
	) {}

	get code() {
		return `${this.subject} ${this.number}`;
	}

	async fetchInfo() {
		if (this.classes && this.name) return;

		const parser = new CourseInfoParser(this);

		this.classes = await parser.getClasses();
		this.name = await parser.getName();
	}
}
