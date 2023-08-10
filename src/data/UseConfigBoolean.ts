import { useEffect, useState } from 'react';

export default function useConfigBoolean(name: string) {
	const [isEnabled, setIsEnabled] = useState<boolean>(
		!!localStorage.getItem(name)
	);

	useEffect(() => {
		if (isEnabled) localStorage.setItem(name, '1');
		else localStorage.removeItem(name);
	}, [name, isEnabled]);

	return [isEnabled, setIsEnabled] as const;
}
