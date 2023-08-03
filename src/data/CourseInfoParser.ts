import Class from './Class';
import ClassSlot from './ClassSlot';
import Course from './Course';
import UWParser from './UWParser';

export default class CourseInfoParser extends UWParser {
	private digitRegex = /^\d+$/;
	private classes: Class[] = [];

	private currentClass?: Class;
	private outerTableRows?: HTMLTableRowElement[];
	private scheduleRows?: HTMLTableRowElement[];

	constructor(private course: Course) {
		super();
	}

	private slotFromRow(row: HTMLTableRowElement, colOffset: number = 0) {
		if (!this.currentClass) return;

		const slot = ClassSlot.newFromStrings(
			this.currentClass,
			this.getCellContents(row, 10 + colOffset),
			this.getCellContents(row, 11 + colOffset)
		);

		if (!slot) return false;

		this.currentClass.slots.push(slot);

		return true;
	}

	private classFromRow(row: HTMLTableRowElement) {
		const [type, section] = this.getCellContents(row, 1).split(' ', 2);

		this.currentClass = new Class(
			this.course,
			this.getCellContents(row, 0),
			type,
			section,
			this.getCellContents(row, 2),
			+this.getCellContents(row, 7),
			+this.getCellContents(row, 6),
			this.getCellContents(row, 12)
		);

		if (!this.slotFromRow(row)) {
			delete this.currentClass;
			return;
		}

		let insertIndex = 0;

		while (
			insertIndex < this.classes.length &&
			this.classes[insertIndex].slots[0].start <=
				this.currentClass.slots[0].start
		)
			insertIndex++;

		this.classes.splice(insertIndex, 0, this.currentClass);
	}

	private processRow(row: HTMLTableRowElement) {
		const firstCell = this.getCellContents(row, 0);
		const firstIsNumber = this.digitRegex.test(firstCell);

		if (firstIsNumber) {
			this.classFromRow(row);
			return;
		}

		this.slotFromRow(row, !firstCell ? 0 : -5);
	}

	private async populateTableRows() {
		[this.outerTableRows, this.scheduleRows] = await this.fetchTableRows(
			`/cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=${this.course.sessionCode}&subject=${this.course.subject}&cournum=${this.course.number}`,
			[0, 1]
		);
	}

	async getClasses() {
		this.classes = [];

		if (!this.scheduleRows) await this.populateTableRows();

		this.scheduleRows!.filter((_, i) => i).forEach(this.processRow, this);

		return this.classes;
	}

	async getName() {
		if (!this.outerTableRows) await this.populateTableRows();

		if (!this.outerTableRows![1]) return '';

		return this.getCellContents(this.outerTableRows![1], 3);
	}
}
