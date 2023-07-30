import { ReactElement } from 'react';
import ClassSlot from './ClassSlot';

export default interface ScheduleSlot {
	start: number;
	end: number;
	className: string;
	content?: ReactElement;
	classSlots?: ClassSlot[];
}
