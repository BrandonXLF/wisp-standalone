import { useRef, useState } from 'react';
import Importer from '../data/Importer';
import './ImportButton.css';

export default function ImportButton({ importer }: { importer: Importer }) {
	const [isVisible, setIsVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [successes, setSuccesses] = useState(-1);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	async function importText() {
		// Wait for textarea value update
		await new Promise<void>(resolve => setTimeout(() => resolve(), 0));

		setLoading(true);
		setSuccesses(-1);

		const successCount = await importer.importFromString(
			textareaRef.current?.value ?? ''
		);

		setLoading(false);
		setSuccesses(successCount);
	}

	function buttonClicked() {
		if (!isVisible) {
			setIsVisible(true);
			return;
		}

		setSuccesses(-1);
		setIsVisible(false);
	}

	return (
		<div className="import-area-container">
			<div className="import-area">
				<div className="import-buttons">
					<button onClick={buttonClicked}>
						{isVisible ? 'Close import' : 'Import from Quest'}
					</button>
				</div>
				{isVisible && (
					<>
						<div className="import-instructions">
							<div>1</div>
							<div>
								Open your{' '}
								<a
									target="_blank"
									href="https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL?CONTEXTIDPARAMS=TEMPLATE_ID:PTPPNAVCOL&scname=ADMN_CLASS_SCHEDULE"
								>
									Class Schedule on Quest
								</a>
							</div>
							<div>2</div>
							<div>Copy all the contents of the page</div>
							<div>3</div>
							<div>Paste below</div>
						</div>
						<textarea
							readOnly={loading}
							placeholder="Paste schedule here"
							className="import-text"
							ref={textareaRef}
							onPaste={importText}
						></textarea>
						{loading && <div>Importing...</div>}
						{successes !== -1 && (
							<div>
								Imported {successes} class{successes == 1 ? '' : 'es'}.
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
