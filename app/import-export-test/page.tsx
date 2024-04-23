'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent, useRef, useState } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/playback/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import RangedPlaybackManager from '@/components/ui/playback/ranged-playback-manager';
import PlaybackVolumeManager from '@/components/ui/playback/playback-volume-manager';
import { MusicScore } from '@/types/music';
import { PlaybackManager } from '@/utils/audio/playback';
import { getMeasuresStartAndEndTime } from '@/utils/music/time/measures';

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
	const [testRanges, setTestRanges] = useState<[number, number]>();
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

	return (
		<>
			<ImportExportPage
				setScore={(score) => {
					setScore(score);
					setNewMusicScore(score);
					const ranges = getMeasuresStartAndEndTime(score.parts[0].measures, {
						durationStartIndex: 14,
						durationEndIndex: 20,
					});
					if (ranges) setTestRanges(ranges);
				}}
				setImportedAudio={setImportedAudio}
				musicScore={musicScore}
			/>
			<PlaybackVolumeManager
				volumePairs={volumePairs}
				modifyVolume={playbackManager.modifyVolume}
				onPlay={playMusic}
				onStop={stopMusic}
				onSeek={seekMusic}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
			/>
			{/* <button
				onClick={() => {
					setTestRanges([19.354838709677416, 32.9032258064516]);
				}}
			>
				Quick Test
			</button> */}

			{testRanges && playbackManager && (
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
