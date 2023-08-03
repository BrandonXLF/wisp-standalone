import { ReactNode } from 'react';
import './SearchResult.css';

export default function SearchResult({
	onSelected,
	className,
	children
}: {
	className?: string;
	onSelected: () => void;
	children: ReactNode;
}) {
	return (
		<div
			className={`search-result ${className ?? ''}`}
			tabIndex={0}
			onClick={onSelected}
			onKeyDown={e => e.key === 'Enter' && onSelected()}
		>
			{children}
		</div>
	);
}
