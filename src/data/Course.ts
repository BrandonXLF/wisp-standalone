import Class from './Class';
import ClassSlot from './ClassSlot';

const domParser = new DOMParser();

async function fetchTableRows(
	path: string,
	tableNumbers: number
): Promise<HTMLTableRowElement[]>;
async function fetchTableRows(
	path: string,
	tableNumbers: number[]
): Promise<HTMLTableRowElement[][]>;
async function fetchTableRows(path: string, tableNumbers: number | number[]) {
	const res = await fetch(
		`https://www.brandonfowler.me/corstest123/?u=${encodeURIComponent(
			`https://classes.uwaterloo.ca${path}`
		)}`
	);

	if (!Array.isArray(tableNumbers)) tableNumbers = [tableNumbers];

	const doc = domParser.parseFromString(await res.text(), 'text/html');

	const tableCollection = doc.getElementsByTagName('table');

	const tables = tableNumbers.map(tableNumber => {
		const rows = tableCollection[tableNumber]?.rows;

		return rows ? [...rows] : [];
	});

	return tables.length === 1 ? tables[0] : tables;
}

function getCellContents(row: HTMLTableRowElement, index: number) {
	return row.cells[index]?.innerText.trim().replace(/ +/g, ' ') || '';
}

export default class Course {
	public classes: Class[] | undefined;

	constructor(
		public sessionCode: string,
		public subject: string,
		public number: string,
		public name: string = ''
	) {}

	static async getAll(sessionCode: string) {
		const seen: Record<string, boolean> = {};

		return (await fetchTableRows('/uwpcshtm.html', 1))
			.filter((row, i) => i && row.children.length > 1)
			.map(
				row =>
					new Course(
						sessionCode,
						getCellContents(row, 0),
						getCellContents(row, 1),
						getCellContents(row, 2)
					)
			)
			.filter(course => {
				if (seen[course.code]) return false;

				seen[course.code] = true;

				return true;
			});
	}

	get code() {
		return `${this.subject} ${this.number}`;
	}

	classFromTableRow(row: HTMLTableRowElement) {
		if (!this.classes) throw new Error('Classes must be defined');

		const firstCell = row.cells[0].innerText.trim().replace(/ +/g, ' ');
		const currentParent = this.classes.length
			? this.classes[this.classes.length - 1]
			: undefined;

		if (!firstCell) {
			if (!currentParent) return;

			const slot = ClassSlot.newFromStrings(
				currentParent,
				getCellContents(row, 10),
				getCellContents(row, 11)
			);

			if (slot) currentParent.slots.push(slot);

			return;
		}

		if (Number.isNaN(+firstCell)) return;

		const [type, section] = row.cells[1].innerText
			.trim()
			.replace(/ +/g, ' ')
			.split(' ', 2);

		const classInfo = new Class(
			this,
			firstCell,
			type,
			section,
			getCellContents(row, 2),
			+getCellContents(row, 7),
			+getCellContents(row, 6),
			getCellContents(row, 12)
		);

		const slot = ClassSlot.newFromStrings(
			classInfo,
			getCellContents(row, 10),
			getCellContents(row, 11)
		);

		if (!slot) return;

		classInfo.slots.push(slot);
		this.classes.push(classInfo);
	}

	async fetchInfo() {
		if (this.classes && this.name) return;

		const [outerTableRows, scheduleRows] = await fetchTableRows(
			`/cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=${this.sessionCode}&subject=${this.subject}&cournum=${this.number}`,
			[0, 1]
		);

		if (outerTableRows[1]) this.name = getCellContents(outerTableRows[1], 3);

		this.classes = [];

		scheduleRows.filter((_, i) => i).forEach(this.classFromTableRow, this);

		this.classes.sort(
			(a, b) => a.slots[0].start.index - b.slots[0].start.index
		);
	}
}
