import { FunctionComponent, useRef } from 'react';
import JSONBracesSVG from '../../svg/json-braces';
import { importJSONScore, importMusicXMLScore } from '@/utils/import-export';
import { MusicScore } from '@/types/music';
import TaskbarDropdown from './taskbar-dropdown';
import XMLBracesSVG from '../../svg/xml-braces';
import ImportIconSVG from '../../svg/import-icon-svg';
import { FileScoreRetriever } from '@/types/import-export';

interface ImportScoreDropdownProps {
	setScore: (score: MusicScore) => void;
}

const ImportScoreDropdown: FunctionComponent<ImportScoreDropdownProps> = ({
	setScore,
}) => {
	const jsonInputRef = useRef<HTMLInputElement>(null);
	const xmlInputRef = useRef<HTMLInputElement>(null);

	const fileScoreSetter = async (
		file: File,
		scoreRetriever: FileScoreRetriever
	) => {
		const score = await scoreRetriever(file);
		if (!score) console.log('Could not get score...');
		else setScore(score);
	};

	return (
		<TaskbarDropdown title="Import Score" headerIcon={<ImportIconSVG />}>
			<button
				onClick={() => {
					if (jsonInputRef.current) jsonInputRef.current.click();
				}}
			>
				<input
					type="file"
					accept=".json"
					style={{ display: 'none' }}
					ref={jsonInputRef}
					onChange={() => {
						if (!jsonInputRef.current || !jsonInputRef.current.files) return;
						console.log('parse json file');
						fileScoreSetter(jsonInputRef.current.files[0], importJSONScore);
					}}
				/>
				<p>JSON</p>
				<JSONBracesSVG />
			</button>
			<button
				onClick={() => {
					if (xmlInputRef.current) xmlInputRef.current.click();
				}}
			>
				<input
					type="file"
					accept=".musicxml, .xml, application/xml, text/xml"
					style={{ display: 'none' }}
					ref={xmlInputRef}
					onChange={async () => {
						if (!xmlInputRef.current || !xmlInputRef.current.files) return;
						console.log('parse xml file');
						fileScoreSetter(xmlInputRef.current.files[0], importMusicXMLScore);
					}}
				/>
				<p>MusicXML</p>
				<XMLBracesSVG />
			</button>
		</TaskbarDropdown>
	);
};

export default ImportScoreDropdown;
