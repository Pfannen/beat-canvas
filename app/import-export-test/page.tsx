'use client';

import { FunctionComponent } from 'react';
import classes from './ImportExportPage.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import { ohWhatANightScore } from '@/utils/audio/play-music';
import { MusicScore } from '@/types/music';
import { exportJSONScore, exportMusicXMLScore } from '@/utils/import-export';

interface ImportExportPageProps {}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = () => {
	return (
		<div className={classes.container}>
			<TaskbarButton onClick={exportJSONScore.bind(null, ohWhatANightScore)}>
				Export JSON
			</TaskbarButton>
			<TaskbarButton
				onClick={exportMusicXMLScore.bind(null, ohWhatANightScore)}
			>
				Export MusicXML
			</TaskbarButton>
			<input type="file" />
		</div>
	);
};

export default ImportExportPage;
