'use client';

import { FunctionComponent } from 'react';
import classes from './index.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import ImportScoreDropdown from '../taskbar/dropdown/import-score-dropdown';
import ImportAudioDropdown from '../taskbar/dropdown/import-audio-dropdown';
import ExportScoreDropdown from '../taskbar/dropdown/export-score-dropdown';
import { MusicScore } from '@/types/music';

interface ImportExportPageProps {
	setScore: (score: MusicScore) => void;
	setImportedAudio: (audio: File) => void;
	play: () => void;
	musicScore?: MusicScore;
}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = ({
	setScore,
	setImportedAudio,
	play,
	musicScore,
}) => {
	return (
		<div className={classes.container}>
			<div className={classes.imports}>
				<ExportScoreDropdown musicScore={musicScore} />
				<ImportScoreDropdown setScore={setScore} />
				<ImportAudioDropdown setImportedAudio={setImportedAudio} />
			</div>
			<TaskbarButton onClick={play} className={classes.play_btn}>
				Play
			</TaskbarButton>
		</div>
	);
};

export default ImportExportPage;
