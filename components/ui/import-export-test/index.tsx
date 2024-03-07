'use client';

import { FunctionComponent, useRef } from 'react';
import classes from './index.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import { playMusicScore } from '@/utils/audio/play-music/play-music';
import {
	exportJSONScore,
	exportMusicXMLScore,
	importMusicXMLScore,
} from '@/utils/import-export';
import { useMusic } from '@/components/providers/music';
import { PlaybackManager } from '@/utils/audio/playback';
import ImportScoreDropdown from '../taskbar/dropdown/import-score-dropdown';
import ImportAudioDropdown from '../taskbar/dropdown/import-audio-dropdown';
import ExportScoreDropdown from '../taskbar/dropdown/export-score-dropdown';

interface ImportExportPageProps {
	playbackManager: PlaybackManager;
}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = ({
	playbackManager,
}) => {
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

	return (
		<div className={classes.container}>
			<div className={classes.imports}>
				<ExportScoreDropdown />
				<ImportScoreDropdown setScore={setNewMusicScore} />
				<ImportAudioDropdown playbackManager={playbackManager} />
			</div>
			<TaskbarButton
				onClick={() => {
					if (playbackManager) playbackManager.play();
					else if (musicScore && musicScore.parts) playMusicScore(musicScore);
				}}
				className={classes.play_btn}
			>
				Play
			</TaskbarButton>
		</div>
	);
};

export default ImportExportPage;
