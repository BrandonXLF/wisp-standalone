import Class from './Class';
import Course from './Course';
import Session from './Session';
import StoredClass from './StoredClass';

export default class Importer {
	static IMPORT_REGEX = /^(?:([A-Z]+) (\d+) -|(\d{4}))/gm;

	constructor(
		public session: Session,
		public addClass: (classInfo: Class, listInstance?: number) => void
	) {}

	setSession(session: Session) {
		this.session = session;
	}

	importFromString(str: string): Promise<number> {
		const classes: StoredClass[] = [];

		let activeCourse: [string, string] | undefined;

		for (const match of str.matchAll(Importer.IMPORT_REGEX)) {
			if (match[1]) {
				activeCourse = [match[1], match[2]];
				continue;
			}

			if (activeCourse) classes.push([...activeCourse, match[3]]);
		}

		return this.importFromArray(classes);
	}

	async importFromArray(
		storedClasses: StoredClass[],
		instance?: number
	): Promise<number> {
		let finished = 0;

		await Promise.allSettled(
			storedClasses.map(async ([courseCode, courseNumber, classNumber]) => {
				const course = new Course(this.session.code, courseCode, courseNumber);

				const classInfo = (await course.classes).find(
					classInfo => classInfo.number === classNumber
				);

				if (!classInfo) return;

				this.addClass(classInfo, instance);

				finished++;
			})
		);

		return finished;
	}
}
