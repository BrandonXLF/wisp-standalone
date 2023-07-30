import Class from '../data/Class';
import UWFlowLink from './UWFlowLink';

export default function InstructorLink({ classInfo }: { classInfo: Class }) {
	return (
		<UWFlowLink
			text={classInfo.instructorLast}
			path={classInfo.instructorLink}
		/>
	);
}
