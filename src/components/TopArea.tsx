import { useMemo } from 'react';
import Session from '../data/Session';
import './TopArea.css';

export default function TopArea({
	session,
	onSessionChanged
}: {
	session: Session;
	onSessionChanged: (session: Session) => void;
}) {
	const dropdownOptions = useMemo(() => {
		const dropdownOptions = new Map<string, Session>();

		for (let i = 0, currentSession = Session.getActive().next; i < 5; i++) {
			dropdownOptions.set(currentSession.code, currentSession);
			currentSession = currentSession.prev;
		}

		return dropdownOptions;
	}, []);

	return (
		<hgroup className="top-area">
			<img src="/logo.png" />
			<h2>WISP</h2>
			<select
				value={session.code}
				onChange={e => onSessionChanged(dropdownOptions.get(e.target.value)!)}
			>
				{[...dropdownOptions.entries()].map(([code, currentSession]) => (
					<option key={code} value={code}>
						{currentSession.name}
					</option>
				))}
			</select>
		</hgroup>
	);
}
