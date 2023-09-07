import { ReactNode } from 'react';
import './Popup.css';
import BorderlessButton from './BorderlessButton';
import CloseIcon from '../icons/CloseIcon';

export default function Popup({
	children,
	onClosed,
	contentClass
}: {
    children: ReactNode;
    onClosed: () => void;
    contentClass?: string;
}) {
	return (
		<div className="popup-container">
			<div className="popup">
				<div className='popup-top'>
					<BorderlessButton onClick={onClosed}>
						<CloseIcon />
					</BorderlessButton>
				</div>
				<div className={contentClass}>
					{children}
				</div>
			</div>
		</div>
	);
}
