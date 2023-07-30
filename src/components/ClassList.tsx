import { useEffect, useReducer } from 'react';
import Class from '../data/Class';
import Course from '../data/Course';
import ClassListItem from './ClassListItem';
import UWFlowLink from './UWFlowLink';

export default function ClassList({
	course,
	scheduledClasses,
	addScheduledClass
}: {
	course: Course;
	scheduledClasses: Class[];
	addScheduledClass: (classInfo: Class) => void;
}) {
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	useEffect(() => void course.fetchInfo().then(() => forceUpdate()), [course]);

	return (
		<>
			<div>
				<strong>
					{course.code} {course.name}
				</strong>
			</div>
			<div>
				<UWFlowLink
					text="View on UW Flow"
					path={`/course/${course.code.toLowerCase().replace(/ /g, '')}`}
				/>
			</div>
			{!course.classes && 'Loading'}
			{course.classes?.length === 0 && 'No classes available.'}
			{course.classes?.length &&
				course.classes.map(classInfo => (
					<ClassListItem
						key={classInfo.number}
						classInfo={classInfo}
						scheduledClasses={scheduledClasses}
						onSelected={() => addScheduledClass(classInfo)}
					/>
				))}
		</>
	);
}
