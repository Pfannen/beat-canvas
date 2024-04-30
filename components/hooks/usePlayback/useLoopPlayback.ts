import { usePlayback } from './usePlayback';
import { useEffect, useRef, useState } from 'react';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';

export type LoopPlaybackOptions = {
	loopCount?: number;
	timeBetweenLoops?: number;
};

const defaultLoopCount = 4;
const defaultTBL = 2000;

const useLoopPlayback = (
	playbackManager: MusicPlaybackManager,
	options: LoopPlaybackOptions = {}
) => {
	const {
		volumePairs,
		playbackState,
		seekPercentage,
		playMusic,
		stopMusic,
		seekMusic,
	} = usePlayback(playbackManager);

	const timeoutId = useRef<NodeJS.Timeout | null>(null);
	const [loopCount, setLoopCount] = useState<number>(
		options.loopCount || defaultLoopCount
	);
	const [currentIteration, setCurrentIteration] = useState<number>(0);
	const [isLooping, setIsLooping] = useState<boolean>(false);

	const resetTimeout = () => {
		if (timeoutId.current !== null) {
			clearTimeout(timeoutId.current);
			timeoutId.current = null;
		}
	};

	const startLooping = () => {
		if (currentIteration > loopCount) {
			stopLooping();
			return;
		}
		if (currentIteration === 0) setCurrentIteration(1);
		seekMusic(0);
		playMusic();
		resetTimeout();
		if (!isLooping) setIsLooping(true);
	};

	const stopLooping = () => {
		stopMusic();
		seekMusic(0);
		resetTimeout();
		setCurrentIteration(0);
		if (isLooping) setIsLooping(false);
	};

	const setLoopCountIntercept = (loopCount: number) => {
		loopCount = Math.max(1, loopCount);
		stopLooping();
		setLoopCount(loopCount);
	};

	const loopEnded = (add: number) => {
		stopMusic();
		seekMusic(0);
		setCurrentIteration((iteration) => iteration + add);
		resetTimeout();
		if (currentIteration + add <= loopCount) {
			timeoutId.current = setTimeout(startLooping, defaultTBL);
		} else stopLooping();
	};

	const restartIteration = () => loopEnded(0);

	const skipIteratation = () => {
		loopEnded(1);
	};

	useEffect(() => {
		if (seekPercentage === 1) loopEnded(1);
	}, [seekPercentage]);

	return {
		loopProps: {
			startLooping,
			stopLooping,
			restartIteration,
			skipIteratation,
			setLoopCount: setLoopCountIntercept,
			isLooping,
			currentIteration,
			loopCount,
		},
		playbackProps: {
			volumePairs,
			playbackState,
			seekPercentage,
			playbackManager,
		},
	};
};

export default useLoopPlayback;
