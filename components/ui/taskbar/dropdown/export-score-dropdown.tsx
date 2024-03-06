import { FunctionComponent } from 'react';
import classes from './ExportScoreDropdown.module.css';
import TaskbarDropdown from './taskbar-dropdown';
import JSONBracesSVG from '../../svg/json-braces';
import { exportJSONScore, exportMusicXMLScore } from '@/utils/import-export';
import { MusicScore } from '@/types/music';
import XMLBracesSVG from '../../svg/xml-braces';

interface ExportScoreDropdownProps {
	musicScore?: MusicScore;
}

const ExportScoreDropdown: FunctionComponent<ExportScoreDropdownProps> = ({
	musicScore,
}) => {
	return (
		<TaskbarDropdown title="Export">
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
		</TaskbarDropdown>
	);
};

export default ExportScoreDropdown;
