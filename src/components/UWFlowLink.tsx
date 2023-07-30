import UWFlowIcon from '../icons/UWFlowIcon';
import './UWFlowLink.css';

export default function UWFlowLink({
	text,
	path
}: {
	text?: string;
	path?: string;
}) {
	if (!text) return;

	return (
		<a
			target="uw-flow"
			href={`https://uwflow.com${path}`}
			onClick={e => e.stopPropagation()}
		>
			<UWFlowIcon />
			{text}
		</a>
	);
}
