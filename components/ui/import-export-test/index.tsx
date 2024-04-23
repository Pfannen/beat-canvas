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
	musicScore?: MusicScore;
}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = ({
	setScore,
	setImportedAudio,
	musicScore,
}) => {
	return (
		<div className={classes.container}>
			<div className={classes.imports}>
				<ExportScoreDropdown musicScore={musicScore} />
				<ImportScoreDropdown setScore={setScore} />
				<ImportAudioDropdown setImportedAudio={setImportedAudio} />
			</div>
		</div>
	);
};

export default ImportExportPage;
