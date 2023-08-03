import NamedCourse from './NamedCourse';
import UWParser from './UWParser';

export default class OfferingsParser extends UWParser {
	private courses: NamedCourse[] = [];
	private seenCourses: Record<string, boolean> = {};

	constructor(private sessionCode: string) {
		super();
	}

	private courseFromRow(row: HTMLTableRowElement) {
		const course = new NamedCourse(
			this.sessionCode,
			this.getCellContents(row, 0),
			this.getCellContents(row, 1),
			this.getCellContents(row, 2)
		);

		if (this.seenCourses[course.code]) return;

		this.seenCourses[course.code] = true;

		this.courses.push(course);
	}

	async getCourses() {
		this.courses = [];

		const rows = await this.fetchTableRows('/uwpcshtm.html', 1);

		rows
			.filter((row, i) => i && row.children.length > 1)
			.forEach(this.courseFromRow, this);

		return this.courses;
	}
}
