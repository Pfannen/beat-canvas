'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent, useState } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/playback/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManager from '@/components/ui/playback/playback-manager';
import RangedPlaybackManager from '@/components/ui/playback/ranged-playback-manager';

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
		playbackManager,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback();
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();
	const [testRanges, setTestRanges] = useState<[number, number]>();

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
				modifyVolume={playbackManager.modifyVolume}
			/>
			<PlaybackManager
				onPlay={playMusic}
				onStop={stopMusic}
				onSeek={seekMusic}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
			/>
			<button
				onClick={() => {
					setTestRanges([10, 50]);
				}}
			>
				Quick Test
			</button>

			{testRanges && (
				<RangedPlaybackManager
					sourcePlaybackManager={playbackManager}
					start={testRanges[0]}
					end={testRanges[1]}
				/>
			)}
		</>
	);
};

export default ImportExportTestPage;
