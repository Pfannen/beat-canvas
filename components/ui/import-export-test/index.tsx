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

interface ImportExportPageProps {}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

	return (
		<div className={classes.container}>
			<TaskbarButton
				onClick={() => {
					if (musicScore) exportJSONScore(musicScore);
				}}
			>
				Export JSON
			</TaskbarButton>
			<TaskbarButton
				onClick={() => {
					if (musicScore) exportMusicXMLScore(musicScore);
				}}
			>
				Export MusicXML
			</TaskbarButton>
			<input
				type="file"
				ref={inputRef}
				accept=".xml, .musicxml"
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
							console.log('hit');
							if (musicScore) {
								setNewMusicScore(musicScore);
								replaceMeasures(musicScore.parts[0].measures);
							}

							console.log(musicScore);
						});
					}
				}}
			/>

			<TaskbarButton
				onClick={() => {
					if (musicScore && musicScore.parts) playMusicScore(musicScore);
				}}
			>
				Play
			</TaskbarButton>
		</div>
	);
};

export default ImportExportPage;
