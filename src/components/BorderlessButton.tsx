import './BorderlessButton.css';

export default function BorderlessButton(
	props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	return (
		<button {...props} className={`borderless-btn ${props.className ?? ''}`} />
	);
}
