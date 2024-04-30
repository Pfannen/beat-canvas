import { FunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './RangedPlaybackManager.module.css';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';
/* import { PlaybackManager as MusicPlaybackManager } from '@/utils/audio/playback'; */
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManagerComponent from '../playback-manager';
import PlaybackVolumeManager from '../playback-volume-manager';
import useLoopPlayback from '@/components/hooks/usePlayback/useLoopPlayback';

interface LoopPlaybackManagerProps {
	sourcePlaybackManager: MusicPlaybackManager;
	start: number;
	end: number;
}

const DEFAULT_LOOP_COUNT = 4;
const MAX_LOOP_COUNT = 10;
const MIN_LOOP_COUNT = 1;

const getValidLoopCountValue = (attemptedLoopCount: number) => {
	return Math.min(MAX_LOOP_COUNT, Math.max(MIN_LOOP_COUNT, attemptedLoopCount));
};

const LoopPlaybackManager: FunctionComponent<LoopPlaybackManagerProps> = ({
	sourcePlaybackManager,
	start,
	end,
}) => {
	const [rangedPBM, _] = useState<MusicPlaybackManager>(() =>
		sourcePlaybackManager.copy([start, end])
	);

	const { loopProps, playbackProps } = useLoopPlayback(rangedPBM, {
		loopCount: DEFAULT_LOOP_COUNT,
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const onSeek = (seekPercent: number) => {
		if (seekPercent === 0) loopProps.restartIteration();
		else if (seekPercent === 1) loopProps.skipIteratation();
	};

	return (
		<div>
			<PlaybackVolumeManager
				volumePairs={playbackProps.volumePairs}
				modifyVolume={playbackProps.playbackManager.modifyVolume}
				title="Ranged Measures"
				onPlay={loopProps.startLooping}
				onStop={loopProps.stopLooping}
				onSeek={onSeek}
				seekPercentage={playbackProps.seekPercentage}
				playbackState={playbackProps.playbackState}
				disableUserSliding={true}
				stopPlaybackOnButtonSeek={false}
			/>
			<div>
				<label htmlFor="loop-count" aria-disabled={loopProps.isLooping}>
					Loop Count:{' '}
				</label>
				<input
					type="number"
					step="1"
					min="1"
					max="10"
					id="loop-count"
					disabled={loopProps.isLooping}
					defaultValue={DEFAULT_LOOP_COUNT}
					onBlur={(e) => {
						const loopCount = getValidLoopCountValue(+e.target.value);
						if (inputRef.current) {
							inputRef.current.value = loopCount.toString();
						}
						loopProps.setLoopCount(loopCount);
					}}
					ref={inputRef}
				/>
				<p>Current Iteration: {loopProps.currentIteration}</p>
			</div>
		</div>
	);
};

export default LoopPlaybackManager;
