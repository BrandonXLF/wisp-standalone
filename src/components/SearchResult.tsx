import { ReactNode } from 'react';
import './SearchResult.css';

export default function SearchResult({
	onChosen,
	className,
	children
}: {
	className?: string;
	onChosen: () => void;
	children: ReactNode;
}) {
	return (
		<div
			className={`search-result ${className ?? ''}`}
			tabIndex={0}
			onClick={onChosen}
			onKeyDown={e => e.key === 'Enter' && onChosen()}
		>
			{children}
		</div>
	);
}
