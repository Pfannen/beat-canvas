import { FunctionComponent } from 'react';
import classes from './ExportScoreDropdown.module.css';
import TaskbarDropdown from '../taskbar-dropdown';
import JSONBracesSVG from '../../../svg/json-braces';
import {
	exportAudioBuffer,
	exportJSONScore,
	exportMusicXMLScore,
} from '@/utils/import-export';
import { MusicScore } from '@/types/music';
import XMLBracesSVG from '../../../svg/xml-braces';
import ExportIconSVG from '../../../svg/export-icon-svg';
import MP3SVG from '../../../svg/mp3';
import ExportPDFButton from './pdf-button';

export interface ExportScoreDropdownProps {
	musicScore?: MusicScore;
	getAudioBuffer?: () => Promise<AudioBuffer | null>;
}

const ExportScoreDropdown: FunctionComponent<ExportScoreDropdownProps> = ({
	musicScore,
	getAudioBuffer,
}) => {
	return (
		<TaskbarDropdown title="Export" headerIcon={<ExportIconSVG />}>
			<button
				onClick={() => {
					if (musicScore) exportJSONScore(musicScore);
				}}
			>
				JSON
				<JSONBracesSVG />
			</button>
			<button
				onClick={() => {
					if (musicScore) exportMusicXMLScore(musicScore);
				}}
			>
				MusicXML
				<XMLBracesSVG />
			</button>
			<button
				onClick={async () => {
					if (!getAudioBuffer) return;

					const buffer = await getAudioBuffer();
					if (!buffer) return;
					exportAudioBuffer(
						buffer,
						musicScore ? musicScore.title : 'Nice test'
					);
				}}
			>
				Mp3
				<MP3SVG />
			</button>
			<ExportPDFButton score={musicScore} />
		</TaskbarDropdown>
	);
};

export default ExportScoreDropdown;
