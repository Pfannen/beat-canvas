'use client';

import MusicProvider from '@/components/providers/music';
import Workspace from '@/components/ui/workspace';
import ImportExportTest from '@/components/ui/import-export-test';
import { MusicScore } from '@/types/music';
import MainImportExportNavBar from '@/components/ui/import-export-test/main-import-export-nav-bar';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManager from '@/components/ui/playback/playback-manager';
import VolumeManager from '@/components/ui/playback/volume-manager';
import PlaybackVolumeManager from '@/components/ui/playback/playback-volume-manager';
import MusicScorePlaybackVolumeManager from '@/components/ui/playback/music-score-playback-volume-manager';
import { useRef, useState } from 'react';

export default function Home() {
	const setImportedAudioRef = useRef<(file: File) => void>(() => {});

	const setImportedAudio = (del: (file: File) => void) => {
		setImportedAudioRef.current = del;
	};

	return (
		<MusicProvider>
			<MainImportExportNavBar setImportedAudioRef={setImportedAudioRef} />
			<MusicScorePlaybackVolumeManager
				setImportedAudioLifter={setImportedAudio}
			/>
			<Workspace />
		</MusicProvider>
	);
}
