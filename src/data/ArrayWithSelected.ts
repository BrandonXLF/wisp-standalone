export default class ArrayWithSelected<T> extends Array<T> {
	constructor(
		items: number | T[],
		public selectedIndex: number = (typeof items === 'number'
			? items
			: items.length) - 1
	) {
		if (typeof items === 'number')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			super(items);
		else super(...items);
	}

	get selected() {
		return this[this.selectedIndex];
	}

	get last() {
		return this[this.length - 1];
	}

	clone() {
		return new ArrayWithSelected(this, this.selectedIndex);
	}

	toJSON() {
		return [[...this], this.selectedIndex];
	}
}
