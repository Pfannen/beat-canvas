import { FunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './RangedPlaybackManager.module.css';
import { PlaybackManager } from '@/utils/audio/playback';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManagerComponent from './playback-manager';

interface RangedPlaybackManagerProps {
	sourcePlaybackManager: PlaybackManager;
	start: number;
	end: number;
}

const RangedPlaybackManager: FunctionComponent<RangedPlaybackManagerProps> = ({
	sourcePlaybackManager,
	start,
	end,
}) => {
	const [rangedPBM, _] = useState<PlaybackManager>(() =>
		sourcePlaybackManager.copy([start, end])
	);

	const {
		playMusic,
		stopMusic,
		seekMusic,
		playbackManager,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback(rangedPBM);

	return (
		<PlaybackManagerComponent
			title="Ranged Measures"
			onPlay={playMusic}
			onStop={stopMusic}
			onSeek={seekMusic}
			seekPercentage={seekPercentage}
			playbackState={playbackState}
		/>
	);
};

export default RangedPlaybackManager;
