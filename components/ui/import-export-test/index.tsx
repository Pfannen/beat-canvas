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

interface ImportExportPageProps {
	playbackManager?: PlaybackManager;
}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = ({
	playbackManager,
}) => {
	const scoreInputRef = useRef<HTMLInputElement>(null);
	const audioInputRef = useRef<HTMLInputElement>(null);
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
			<p>MusicXML --</p>
			<input
				type="file"
				ref={scoreInputRef}
				accept=".xml, .musicxml"
				onChange={() => {
					console.log('hit');
					if (!scoreInputRef.current || !scoreInputRef.current.files) {
						console.log('no file');
						return;
					}

					const file = scoreInputRef.current.files[0];
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
			<p>Audio --</p>
			<input
				type="file"
				accept=".mp3"
				ref={audioInputRef}
				onChange={() => {
					const input = audioInputRef.current;
					if (!input || !input.files || !playbackManager) return;

					playbackManager.setImportedAudio(input.files[0], (success) =>
						console.log('Imported audio: ' + success)
					);
				}}
			/>

			<TaskbarButton
				onClick={() => {
					if (playbackManager) playbackManager.play();
					else if (musicScore && musicScore.parts) playMusicScore(musicScore);
				}}
			>
				Play
			</TaskbarButton>
		</div>
	);
};

export default ImportExportPage;
