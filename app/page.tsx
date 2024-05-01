'use client';

import classes from './page.module.css';
import MusicProvider from '@/components/providers/music';
import Workspace from '@/components/ui/workspace';
import MainImportExportNavBar from '@/components/ui/import-export-test/main-import-export-nav-bar';
import MusicScorePlaybackVolumeManager from '@/components/ui/playback/music-score-playback-volume-manager';
import { useCallback, useRef, useState } from 'react';
import PlaybackVolumeManagerSwapper from '@/components/ui/playback/playback-volume-manager-swapper';
import { Selection } from '@/components/hooks/useSelection';

export default function Home() {
	const setImportedAudioRef = useRef<(file: File) => void>(() => {});
	const updateLoopSelectionRef = useRef<(selection?: Selection) => void>(
		() => {}
	);

	const setImportedAudio = (del: (file: File) => void) => {
		setImportedAudioRef.current = del;
	};
	const setSelectedMeasureLifter = useCallback(
		(del: (selection?: Selection) => void) => {
			updateLoopSelectionRef.current = del;
		},
		[]
	);

	const [getAudioBufferDel, setGetAudioBufferDel] =
		useState<() => Promise<AudioBuffer | null>>();

	const getAudioBufferLifter = useCallback(
		(del: () => Promise<AudioBuffer | null>) => {
			if (getAudioBufferDel !== del) setGetAudioBufferDel(() => del);
		},
		[getAudioBufferDel]
	);

	return (
		<MusicProvider>
			<MainImportExportNavBar
				setImportedAudioRef={setImportedAudioRef}
				getAudioBuffer={getAudioBufferDel}
			/>
			<div className={classes.main_container}>
				<PlaybackVolumeManagerSwapper
					setImportedAudioLifter={setImportedAudio}
					setSelectedMeasuresLifter={setSelectedMeasureLifter}
					getAudioBufferLifter={getAudioBufferLifter}
				/>
				<Workspace updateLoopSelectionRef={updateLoopSelectionRef} />
			</div>
		</MusicProvider>
	);
}
