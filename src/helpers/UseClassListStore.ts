import { useCallback, useEffect, useRef, useState } from 'react';
import Session from '../data/Session';
import ArrayWithSelected from '../data/ArrayWithSelected';
import StoredClass from '../data/StoredClass';
import Class from '../data/Class';

export default function useClassListStore(session: Session) {
	const storageKey = useRef(`wisp-semester-${session}`);
	const [lists, setLists] = useState(
		new ArrayWithSelected<StoredClass[]>([[]], 0)
	);
	const [loading, setLoading] = useState(true);

	const ensureEmpty = useCallback(() => {
		setLists(lists => {
			if (!lists.selected.length) return lists;

			if (lists.last.length) return new ArrayWithSelected([...lists, []]);

			return new ArrayWithSelected(lists);
		});
	}, []);

	const add = useCallback(() => {
		setLists(lists => new ArrayWithSelected([...lists, []]));
	}, []);

	const select = useCallback((index: number) => {
		setLists(lists => new ArrayWithSelected(lists, index));
	}, []);

	const updateSelected = useCallback((classes: Class[]) => {
		setLists(lists => {
			lists = lists.clone();

			lists.selected.splice(0, lists.selected.length);

			classes.forEach(classInfo => {
				lists.selected.push([
					classInfo.course.subject,
					classInfo.course.number,
					classInfo.number
				]);
			});

			return lists;
		});
	}, []);

	const deleteSelected = useCallback(() => {
		setLists(lists => {
			lists = lists.clone();

			lists.splice(lists.selectedIndex, 1);

			if (lists.selectedIndex === lists.length) lists.selectedIndex--;

			if (!lists.length) {
				lists.push([]);
				lists.selectedIndex = 0;
			}

			return lists;
		});
	}, []);

	useEffect(() => {
		setLoading(true);

		storageKey.current = `wisp-semester-${session}`;

		const [storedClassArray = [], selectedIndex = 0]: [
			StoredClass[][],
			number
		] = JSON.parse(localStorage.getItem(storageKey.current) ?? '[]');

		if (!storedClassArray.length) storedClassArray.push([]);

		setLists(new ArrayWithSelected(storedClassArray, selectedIndex));
		setLoading(false);
	}, [session]);

	useEffect(() => {
		if (loading) return;

		localStorage.setItem(storageKey.current, JSON.stringify(lists));
	}, [loading, lists]);

	return [
		lists,
		ensureEmpty,
		add,
		select,
		updateSelected,
		deleteSelected
	] as const;
}
