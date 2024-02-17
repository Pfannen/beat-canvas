'use client';

import { FunctionComponent, useRef } from 'react';
import classes from './ImportExportPage.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import { ohWhatANightScore } from '@/utils/audio/play-music';
import { MusicScore } from '@/types/music';
import {
	exportJSONScore,
	exportMusicXMLScore,
	importMusicXMLScore,
} from '@/utils/import-export';

interface ImportExportPageProps {}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = () => {
	const inputRef = useRef<HTMLInputElement>(null);

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
			<input
				type="file"
				ref={inputRef}
				accept=".xml"
				onChange={() => {
					console.log('hit');
					if (!inputRef.current || !inputRef.current.files) {
						console.log('no file');
						return;
					}

					const file = inputRef.current.files[0];
					if (file.type === 'text/xml' || file.type === 'application/xml') {
						console.log(file.type);
						importMusicXMLScore(file, (musicScore) => console.log(musicScore));
					}
				}}
			/>
		</div>
	);
};

export default ImportExportPage;
