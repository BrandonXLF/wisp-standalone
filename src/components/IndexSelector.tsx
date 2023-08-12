import BorderlessButton from './BorderlessButton';
import './IndexSelector.css';

export default function IndexSelector({
	items,
	selectedIndex,
	onIndexSelected
}: {
	items: Array<unknown>;
	selectedIndex: number;
	onIndexSelected: (index: number) => void;
}) {
	return (
		<>
			{items.map((_, i) => {
				return (
					<BorderlessButton
						key={i}
						onClick={() => onIndexSelected(i)}
						className={i === selectedIndex ? 'selected-button' : ''}
					>
						{i + 1}
					</BorderlessButton>
				);
			})}
		</>
	);
}
