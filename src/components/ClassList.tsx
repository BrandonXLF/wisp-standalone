import { useEffect, useState } from 'react';
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
	const [courseDetails, setCourseDetails] = useState<{
		name: string;
		classes: Class[];
	}>();

	useEffect(() => {
		let valid = true;

		setCourseDetails(undefined);

		(async () => {
			const name = await course.name;
			const classes = await course.classes;

			if (valid) setCourseDetails({ name, classes });
		})();

		return () => {
			valid = false;
		};
	}, [course]);

	return (
		<>
			<div>
				<strong>
					{course.code} {courseDetails?.name ?? ''}
				</strong>
			</div>
			<div>
				<UWFlowLink
					text="View on UW Flow"
					path={`/course/${course.code.toLowerCase().replace(/ /g, '')}`}
				/>
			</div>
			{!courseDetails && 'Loading...'}
			{courseDetails?.classes.length === 0 && 'No classes available.'}
			{!!courseDetails?.classes.length &&
				courseDetails.classes.map(classInfo => (
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
