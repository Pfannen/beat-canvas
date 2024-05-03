import {
	FunctionComponent,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import classes from './loop-playback-manager.module.css';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';
/* import { PlaybackManager as MusicPlaybackManager } from '@/utils/audio/playback'; */
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManagerComponent from '../playback-manager';
import PlaybackVolumeManager from '../playback-volume-manager';
import useLoopPlayback from '@/components/hooks/usePlayback/useLoopPlayback';
import PBVManagerMain from '../styles/pbv-manager-main';
import { useMusic } from '@/components/providers/music';
import { getMeasuresStartAndEndTime } from '@/utils/music/time/measures';
import { useSecondsToMeasureIndex } from '@/components/hooks/usePlayback/useSecondsToMeasureIndex';

const DEFAULT_LOOP_COUNT = 4;
const MAX_LOOP_COUNT = 10;
const MIN_LOOP_COUNT = 1;

const getValidLoopCountValue = (attemptedLoopCount: number) => {
	return Math.min(MAX_LOOP_COUNT, Math.max(MIN_LOOP_COUNT, attemptedLoopCount));
};

export interface LoopPlaybackManagerProps {
	sourcePlaybackManager: MusicPlaybackManager;
	start: number;
	end: number;
	stopLooping?: () => void;
	playedMeasureUpdated?: (index: number | null) => void;
}

const LoopPlaybackManager: FunctionComponent<LoopPlaybackManagerProps> = ({
	sourcePlaybackManager,
	start,
	end,
	playedMeasureUpdated,
}) => {
	// Use useMusic so we can get the measures start and end reference (can take in measures later if needed)
	const {
		measuresItems: { measures },
	} = useMusic();

	// Store the ranged pbm in state using set state
	// (so we can initialize it once and have it be present before anything else gets executed)
	const [rangedPBM, _] = useState<MusicPlaybackManager>(() => {
		const [startSeconds, endSeconds] = getMeasuresStartAndEndTime(
			measures,
			{
				durationStartIndex: start,
				durationEndIndex: end,
			},
			true
		);
		return sourcePlaybackManager.copy([startSeconds, endSeconds]);
	});

	const { loopProps, playbackProps } = useLoopPlayback(rangedPBM, {
		loopCount: DEFAULT_LOOP_COUNT,
	});

	const inputRef = useRef<HTMLInputElement>(null);

	const onSeek = (seekPercent: number) => {
		if (seekPercent === 0) loopProps.restartIteration();
		else if (seekPercent === 1) loopProps.skipIteratation();
	};

	const { measureIdx } = useSecondsToMeasureIndex(
		playbackProps.seekPercentage * rangedPBM.getMaxDuration(),
		measures
	);

	useEffect(() => {
		playedMeasureUpdated &&
			playedMeasureUpdated(measureIdx !== null ? measureIdx + start : null);
	}, [measureIdx, playedMeasureUpdated, start]);

	return (
		<>
			<PBVManagerMain
				musicVolumePairs={playbackProps.musicVolumePairMap}
				modifyVolume={playbackProps.playbackManager.modifyVolume}
				title={`Measures ${start + 1} - ${end + 1}`}
				onPlay={loopProps.startLooping}
				onStop={loopProps.stopLooping}
				onSeek={onSeek}
				seekPercentage={playbackProps.seekPercentage}
				playbackState={playbackProps.playbackState}
				disableUserSliding={true}
				stopPlaybackOnButtonSeek={false}
			/>
			<div className={classes.loop_settings}>
				<div className={classes.loop_input_container}>
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
				</div>
				<p>Current Iteration: {loopProps.currentIteration}</p>
			</div>
		</>
	);
};

export default LoopPlaybackManager;
