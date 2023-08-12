import { useEffect } from 'react';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import DarkIcon from '../icons/DarkIcon';
import LightIcon from '../icons/LightIcon';
import BorderlessButton from './BorderlessButton';
import './Footer.css';

export default function Footer() {
	const [darkMode, setDarkMode] = useConfigBoolean('wisp-dark');

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
	}, [darkMode]);

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
				<BorderlessButton onClick={() => setDarkMode(!darkMode)}>
					{darkMode ? <LightIcon /> : <DarkIcon />}
				</BorderlessButton>
			</div>
		</footer>
	);
}
