'use client';

import { FunctionComponent, useRef } from 'react';
import classes from './ImportExportPage.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import {
	ohWhatANight,
	ohWhatANightScore,
	playMeasures,
} from '@/utils/audio/play-music';
import {
	exportJSONScore,
	exportMusicXMLScore,
	importMusicXMLScore,
} from '@/utils/import-export';
import { MusicScore } from '@/types/music';

interface ImportExportPageProps {}

let curScore: MusicScore | null = ohWhatANightScore;

const ImportExportPage: FunctionComponent<ImportExportPageProps> = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={classes.container}>
			<TaskbarButton
				onClick={() => {
					if (curScore) exportJSONScore(curScore);
				}}
			>
				Export JSON
			</TaskbarButton>
			<TaskbarButton
				onClick={() => {
					if (curScore) exportMusicXMLScore(curScore);
				}}
			>
				Export MusicXML
			</TaskbarButton>
			<input
				type="file"
				ref={inputRef}
				accept=".xml, MUSICXML"
				onChange={() => {
					console.log('hit');
					if (!inputRef.current || !inputRef.current.files) {
						console.log('no file');
						return;
					}

					const file = inputRef.current.files[0];
					console.log(file.type);
					// TODO: Allow musicxml files to bring back the IF check
					if (
						true /* file.type === 'text/xml' || file.type === 'application/xml' */
					) {
						importMusicXMLScore(file, (musicScore) => {
							if (musicScore) curScore = musicScore;
							console.log(musicScore);
						});
					}
				}}
			/>

			<TaskbarButton
				onClick={() => {
					if (curScore && curScore.parts)
						playMeasures(curScore.parts[0].measures);
				}}
			>
				Play
			</TaskbarButton>
		</div>
	);
};

export default ImportExportPage;
