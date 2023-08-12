import { useCallback, useEffect, useState } from 'react';

export default function useRemainingHeight({
	container,
	prevSibling,
	verticalRelativesContainer,
	offset
}: {
	container: HTMLElement | null;
	prevSibling: HTMLElement | null;
	verticalRelativesContainer: HTMLElement | null;
	offset: number;
}) {
	const [maxHeight, setMaxHeight] = useState<string>();

	const calculateMaxHeight = useCallback(() => {
		if (!container || !prevSibling) return;

		setMaxHeight(
			`${
				container.getBoundingClientRect().bottom -
				prevSibling.getBoundingClientRect().bottom -
				offset
			}px`
		);
	}, [container, offset, prevSibling]);

	useEffect(() => {
		if (!container || !verticalRelativesContainer) return;

		const resizeObserver = new ResizeObserver(calculateMaxHeight);
		const mutationObserver = new MutationObserver(calculateMaxHeight);

		resizeObserver.observe(container);
		mutationObserver.observe(verticalRelativesContainer, {
			childList: true,
			subtree: true
		});

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [container, verticalRelativesContainer, calculateMaxHeight]);

	return maxHeight;
}
