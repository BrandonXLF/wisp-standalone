import { useEffect, useState } from 'react';
import Class from '../data/Class';
import Course from '../data/Course';
import ClassListItem from './ClassListItem';
import UWFlowLink from './UWFlowLink';

export default function ClassList({
	course,
	scheduledClasses,
	onClassSelected
}: {
	course: Course;
	scheduledClasses: Class[];
	onClassSelected: (classInfo: Class) => void;
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
					path={`/course/${course.code.toLowerCase().replace(/ /g, '')}`}
				>
					View on UW Flow
				</UWFlowLink>
			</div>
			{!courseDetails && 'Loading...'}
			{courseDetails?.classes.length === 0 && 'No classes available.'}
			{!!courseDetails?.classes.length &&
				courseDetails.classes.map(classInfo => (
					<ClassListItem
						key={classInfo.number}
						classInfo={classInfo}
						scheduledClasses={scheduledClasses}
						onSelected={() => onClassSelected(classInfo)}
					/>
				))}
		</>
	);
}
