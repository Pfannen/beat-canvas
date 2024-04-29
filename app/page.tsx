'use client';

import classes from './page.module.css';
import MusicProvider from '@/components/providers/music';
import Workspace from '@/components/ui/workspace';
import MainImportExportNavBar from '@/components/ui/import-export-test/main-import-export-nav-bar';
import MusicScorePlaybackVolumeManager from '@/components/ui/playback/music-score-playback-volume-manager';
import { useRef } from 'react';

export default function Home() {
	const setImportedAudioRef = useRef<(file: File) => void>(() => {});

	const setImportedAudio = (del: (file: File) => void) => {
		setImportedAudioRef.current = del;
	};

	return (
		<MusicProvider>
			<MainImportExportNavBar setImportedAudioRef={setImportedAudioRef} />
			<div className={classes.main_container}>
				<MusicScorePlaybackVolumeManager
					setImportedAudioLifter={setImportedAudio}
				/>
				<Workspace />
			</div>
		</MusicProvider>
	);
}
