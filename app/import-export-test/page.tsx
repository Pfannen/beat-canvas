'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/playback/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import LoopPlaybackManager from '@/components/ui/playback/loop-playback/loop-playback-manager';
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
	const {
		scoreItems: { musicScore, replaceMusicScore },
	} = useMusic();

	return (
		<>
			<ImportExportPage
				setScore={(score) => {
					setScore(score);
					replaceMusicScore(score);
				}}
				setImportedAudio={setImportedAudio}
				musicScore={musicScore}
				getAudioBuffer={playbackManager.getMergedAudioBufffer}
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
			<button
				onClick={() => {
					if (!musicScore) return;
					const ranges = getMeasuresStartAndEndTime(
						musicScore.parts[0].measures,
						{
							durationStartIndex: 14,
							durationEndIndex: 15,
						}
					);
					setTestRanges(ranges);
				}}
			>
				Quick Test
			</button>

			{testRanges && playbackManager && (
				<LoopPlaybackManager
					sourcePlaybackManager={playbackManager}
					start={testRanges[0]}
					end={testRanges[1]}
				/>
			)}
		</>
	);
};

export default ImportExportTestPage;
