import DarkIcon from '../icons/DarkIcon';
import LightIcon from '../icons/LightIcon';
import BorderlessButton from './BorderlessButton';
import './Footer.css';

export default function Footer({
	darkMode,
	onDarkModeToggled
}: {
	darkMode: boolean;
	onDarkModeToggled: () => void;
}) {
	return (
		<footer>
			<div>
				Developed by{' '}
				<a
					target="_blank"
					href="https://www.brandonfowler.me/"
					rel="noreferrer"
				>
					Brandon Fowler
				</a>
				.
			</div>
			<div>
				<BorderlessButton onClick={() => onDarkModeToggled()}>
					{darkMode ? <LightIcon /> : <DarkIcon />}
				</BorderlessButton>
			</div>
		</footer>
	);
}
