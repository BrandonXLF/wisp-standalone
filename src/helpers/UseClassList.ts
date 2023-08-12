import { useCallback, useEffect, useRef, useState } from 'react';
import Class from '../data/Class';
import Session from '../data/Session';
import Importer from '../data/Importer';
import StoredClass from '../data/StoredClass';
import LoadingStatus from '../data/LoadingStatus';

export default function useClassList(
	source: StoredClass[],
	updateSource: (classes: Class[]) => void,
	session: Session
) {
	const [classes, setClasses] = useState<Class[]>([]);
	const [status, setStatus] = useState(LoadingStatus.Loading);
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

		setStatus(LoadingStatus.Loading);
		setClasses([]);

		importer.current.importFromArray(source, listInstance).then(res => {
			if (listInstance !== currentInstance.current) return;

			setStatus(res.hadError ? LoadingStatus.Error : LoadingStatus.Ready);
		});
	}, [source, importer]);

	useEffect(() => {
		if (status !== LoadingStatus.Ready) return;

		updateSource(classes);
	}, [classes, status, updateSource]);

	return [classes, status, importer, addClass, removeClass] as const;
}
