import { useCallback, useEffect, useRef, useState } from 'react';
import Class from '../data/Class';
import Session from '../data/Session';
import Importer from '../data/Importer';
import StoredClass from '../data/StoredClass';

export default function useClassList(
	source: StoredClass[],
	updateSource: (classes: Class[]) => void,
	session: Session
) {
	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState(true);
	const currentInstance = useRef(0);

	const addClass = useCallback((classInfo: Class, listInstance?: number) => {
		setClasses(classes => {
			if (
				classes.some(
					existingClass => existingClass.number == classInfo.number
				) ||
				(listInstance !== undefined && listInstance !== currentInstance.current)
			)
				return classes;

			return [...classes, classInfo];
		});
	}, []);

	const removeClass = useCallback((classInfo: Class) => {
		setClasses(classes =>
			classes.filter(existingClass => classInfo.number !== existingClass.number)
		);
	}, []);

	const importer = useRef(new Importer(session, addClass));

	useEffect(() => importer.current.setSession(session), [session]);

	useEffect(() => {
		const listInstance = ++currentInstance.current;

		setLoading(true);
		setClasses([]);

		importer.current.importFromArray(source, listInstance).then(() => {
			if (listInstance !== currentInstance.current) return;

			setLoading(false);
		});
	}, [source, importer]);

	useEffect(() => {
		if (loading) return;

		updateSource(classes);
	}, [classes, loading, updateSource]);

	return [classes, loading, importer, addClass, removeClass] as const;
}
