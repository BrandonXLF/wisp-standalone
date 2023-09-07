import { useCallback, useRef, useState } from 'react';
import Importer from '../data/Importer';
import './QuestImporter.css';
import Popup from './Popup';

export default function QuestImporter({
	importer,
	onEmptyClassListRequired,
	onClosed
}: {
	importer: Importer;
	onEmptyClassListRequired: () => void;
	onClosed: () => void;
}) {
	const [loading, setLoading] = useState(false);
	const [successes, setSuccesses] = useState(-1);

	const importText = useCallback(async () => {
		// Wait for textarea value update
		await new Promise<void>(resolve => setTimeout(() => resolve(), 0));

		setLoading(true);
		setSuccesses(-1);
		onEmptyClassListRequired();

		const successCount = (
			await importer.importFromString(textareaRef.current?.value ?? '')
		).count;

		setLoading(false);
		setSuccesses(successCount);
	}, [importer, onEmptyClassListRequired]);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<Popup onClosed={onClosed} contentClass="import-area">
			<div className="import-instructions">
				<div>1)</div>
				<div>
						Open your{' '}
					<a
						target="_blank"
						href="https://quest.pecs.uwaterloo.ca/psc/SS/ACADEMIC/SA/c/NUI_FRAMEWORK.PT_AGSTARTPAGE_NUI.GBL?CONTEXTIDPARAMS=TEMPLATE_ID:PTPPNAVCOL&scname=ADMN_CLASS_SCHEDULE"
						rel="noreferrer"
					>
							Class Schedule on Quest
					</a>
				</div>
				<div>2)</div>
				<div>Copy all the contents of the page</div>
				<div>3)</div>
				<div>Paste below</div>
			</div>
			<textarea
				readOnly={loading}
				placeholder="Paste schedule here"
				className="import-text"
				ref={textareaRef}
				onPaste={importText}
			/>
			{loading && <div>Importing...</div>}
			{successes !== -1 && (
				<div>
						Imported {successes} class{successes == 1 ? '' : 'es'}.
				</div>
			)}
		</Popup>
	);
}
