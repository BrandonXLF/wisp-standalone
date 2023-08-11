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
	const [loading, setLoading] = useState(true);
	const [classes, setClasses] = useState<Class[]>([]);
	const sessionCode = useRef(session.code);

	const addClass = useCallback((classInfo: Class) => {
		setClasses(classes => {
			if (
				classes.some(
					existingClass => existingClass.number == classInfo.number
				) ||
				classInfo.course.sessionCode !== sessionCode.current
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

	const importerRef = useRef(new Importer(session, addClass));

	useEffect(() => {
		sessionCode.current = session.code;
		importerRef.current.setSession(session);
	}, [session]);

	useEffect(() => {
		setLoading(true);
		setClasses([]);

		importerRef.current.importFromArray(source).then(() => setLoading(false));
	}, [source, importerRef]);

	useEffect(() => {
		if (loading) return;

		updateSource(classes);
	}, [classes, loading, updateSource]);

	return [classes, loading, importerRef, addClass, removeClass] as const;
}
