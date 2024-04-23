'use client';

import MusicProvider from '@/components/providers/music';
import Workspace from '@/components/ui/workspace';
import ImportExportTest from '@/components/ui/import-export-test';
import { MusicScore } from '@/types/music';
import MainImportExportNavBar from '@/components/ui/import-export-test/main-import-export-nav-bar';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManager from '@/components/ui/playback/playback-manager';
import VolumeManager from '@/components/ui/playback/volume-manager';

export default function Home() {
	const {
		setScore,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
		volumeModifier,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback();

	return (
		<MusicProvider>
			{/* <ImportExportTest
				setScore={function (score: MusicScore): void {
					throw new Error('Function not implemented.');
				}}
				setImportedAudio={function (audio: File): void {
					throw new Error('Function not implemented.');
				}}
			/> */}
			<MainImportExportNavBar
				setImportedAudio={setImportedAudio}
				setScore={setScore}
			/>
			<VolumeManager
				volumePairs={volumePairs}
				modifyVolume={volumeModifier.modifyVolume}
			/>
			<PlaybackManager
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
