'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/playback/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManager from '@/components/ui/playback/playback-manager';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
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
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

	return (
		<>
			<ImportExportPage
				setScore={(score) => {
					setScore(score);
					setNewMusicScore(score);
				}}
				setImportedAudio={setImportedAudio}
				musicScore={musicScore}
			/>
			<VolumeManager
				volumePairs={volumePairs}
				modifyVolume={volumeModifier.modifyVolume}
			/>
			<PlaybackManager
				onPlay={playMusic}
				onStop={stopMusic}
				onSeek={seekMusic}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
			/>
		</>
	);
};

export default ImportExportTestPage;
