export default class ClassTime {
	public hours;
	public minutes;
	public index;

	constructor(timeStr: string, end = false) {
		const [hourStr, minuteStr] = timeStr.split(':');

		this.hours = parseInt(hourStr);
		this.minutes = parseInt(minuteStr);
		this.index =
			(end || this.hours < 8 ? this.hours + 12 : this.hours) * 60 +
			this.minutes;
	}

	valueOf() {
		return this.index;
	}

	toString() {
		return `${this.hours % 12 || 12}:${this.minutes
			.toString()
			.padStart(2, '0')}`;
	}
}
