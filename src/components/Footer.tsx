import { useEffect } from 'react';
import useConfigBoolean from '../helpers/UseConfigBoolean';
import DarkIcon from '../icons/DarkIcon';
import LightIcon from '../icons/LightIcon';
import BorderlessButton from './BorderlessButton';
import './Footer.css';
import GitHubIcon from '../icons/GitHubIcon';

export default function Footer() {
	const [darkMode, setDarkMode] = useConfigBoolean('wisp-dark');

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode);
	}, [darkMode]);

	return (
		<footer>
			<div>
				<div>
					Created by{' '}
					<a
						target="_blank"
						href="https://www.brandonfowler.me/"
						rel="noreferrer"
					>
						Brandon Fowler
					</a>
				</div>
				<div>
					{' '}
					<a
						target="_blank"
						href="https://github.com/BrandonXLF/wisp"
						rel="noreferrer"
					>
						<GitHubIcon />
						GitHub
					</a>
				</div>
			</div>
			<div>
				<BorderlessButton onClick={() => setDarkMode(!darkMode)}>
					{darkMode ? <LightIcon /> : <DarkIcon />}
				</BorderlessButton>
			</div>
		</footer>
	);
}
