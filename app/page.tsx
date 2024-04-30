'use client';

import classes from './page.module.css';
import MusicProvider from '@/components/providers/music';
import Workspace from '@/components/ui/workspace';
import MainImportExportNavBar from '@/components/ui/import-export-test/main-import-export-nav-bar';
import MusicScorePlaybackVolumeManager from '@/components/ui/playback/music-score-playback-volume-manager';
import { useRef } from 'react';
import PlaybackVolumeManagerSwapper from '@/components/ui/playback/playback-volume-manager-swapper';
import { Selection } from '@/components/hooks/useSelection';

export default function Home() {
	const setImportedAudioRef = useRef<(file: File) => void>(() => {});
	const updateLoopSelectionRef = useRef<(selection?: Selection) => void>(
		() => {}
	);
	const stopLoopingRef = useRef<() => void>(() => {});

	const setImportedAudio = (del: (file: File) => void) => {
		setImportedAudioRef.current = del;
	};

	const setSelectedMeasureLift = (del: (selection?: Selection) => void) => {
		updateLoopSelectionRef.current = del;
	};

	return (
		<MusicProvider>
			<MainImportExportNavBar setImportedAudioRef={setImportedAudioRef} />
			<div className={classes.main_container}>
				{/* <MusicScorePlaybackVolumeManager
					setImportedAudioLifter={setImportedAudio}
				/> */}
				<PlaybackVolumeManagerSwapper
					setImportedAudioLifter={setImportedAudio}
					setSelectedMeasuresLifter={setSelectedMeasureLift}
				/>
				<Workspace updateLoopSelectionRef={updateLoopSelectionRef} />
			</div>
		</MusicProvider>
	);
}
