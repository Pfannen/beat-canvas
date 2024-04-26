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

export default function Home() {
	const {
		setScore,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
		playbackManager,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback();

	return (
		<MusicProvider>
			<MainImportExportNavBar
				setImportedAudio={setImportedAudio}
				setScore={setScore}
			/>
			<PlaybackVolumeManager
				volumePairs={volumePairs}
				modifyVolume={playbackManager.modifyVolume}
				onPlay={playMusic}
				onStop={stopMusic}
				onSeek={seekMusic}
				playbackState={playbackState}
				seekPercentage={seekPercentage}
				title="Home page"
			/>
			<Workspace />
		</MusicProvider>
	);
}
