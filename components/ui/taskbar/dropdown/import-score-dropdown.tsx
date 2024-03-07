import { FunctionComponent, useRef } from 'react';
import classes from './import-score-dropdown.module.css';
import DropdownHeader from '../../reusable/dropdown/dropdown-header';
import JSONBracesSVG from '../../svg/json-braces';
import DropdownList from '../../reusable/dropdown/dropdown-list';
import { PlaybackManager } from '@/utils/audio/playback';
import { importMusicXMLScore } from '@/utils/import-export';
import { MusicScore } from '@/types/music';
import TaskbarDropdown from './taskbar-dropdown';
import XMLBracesSVG from '../../svg/xml-braces';
import ImportIconSVG from '../../svg/import-icon-svg';

interface ImportScoreDropdownProps {
	setScore: (score: MusicScore) => void;
}

const ImportScoreDropdown: FunctionComponent<ImportScoreDropdownProps> = ({
	setScore,
}) => {
	const jsonInputRef = useRef<HTMLInputElement>(null);
	const xmlInputRef = useRef<HTMLInputElement>(null);

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
						//setScore(null);
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
					accept=".musicxml, .xml"
					style={{ display: 'none' }}
					ref={xmlInputRef}
					onChange={() => {
						if (!xmlInputRef.current || !xmlInputRef.current.files) return;

						const file = xmlInputRef.current.files[0];
						importMusicXMLScore(file, (score) => {
							if (score) setScore(score);
						});
					}}
				/>
				<p>MusicXML</p>
				<XMLBracesSVG />
			</button>
		</TaskbarDropdown>
	);
};

export default ImportScoreDropdown;
