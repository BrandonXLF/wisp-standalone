import BorderlessButton from './BorderlessButton';
import './IndexSelector.css';

export default function IndexSelector({
	items,
	selectedIndex,
	setSelectedIndex
}: {
	items: Array<unknown>;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	return (
		<>
			{items.map((_, i) => {
				return (
					<BorderlessButton
						key={i}
						onClick={() => setSelectedIndex(i)}
						className={i === selectedIndex ? 'selected-button' : ''}
					>
						{i + 1}
					</BorderlessButton>
				);
			})}
		</>
	);
}
