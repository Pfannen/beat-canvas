import { FunctionComponent, useState } from 'react';
import classes from './PlaybackVolumeManager.module.css';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import PlaybackManagerComponent, {
	PlaybackManagerProps,
} from './playback-manager';
import VolumeManager, { VolumeManagerProps } from './volume-manager';
import { PlaybackManager } from '@/utils/audio/playback';
import { MusicScore } from '@/types/music';

interface PlaybackVolumeManagerProps
	extends VolumeManagerProps,
		PlaybackManagerProps {
	rangedManager?: { sourcePBM: PlaybackManager; start: number; end: number };
}

const PlaybackVolumeManager: FunctionComponent<PlaybackVolumeManagerProps> = ({
	rangedManager,
	volumePairs,
	modifyVolume,
	title,
	onPlay,
	onStop,
	onSeek,
	seekPercentage,
	playbackState,
}) => {
	const [initPlaybackManager, _] = useState<PlaybackManager | undefined>(() => {
		if (rangedManager) {
			const { sourcePBM, start, end } = rangedManager;
			return sourcePBM.copy([start, end]);
		} else return undefined;
	});
	/* const {
		playMusic,
		stopMusic,
		seekMusic,
		playbackManager,
		volumePairs,
		playbackState,
		seekPercentage,
		setImportedAudio,
		setScore,
	} = usePlayback(initPlaybackManager); */

	return (
		<div>
			<VolumeManager volumePairs={volumePairs} modifyVolume={modifyVolume} />
			<PlaybackManagerComponent
				title={title}
				onPlay={onPlay}
				onStop={onStop}
				onSeek={onSeek}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
			/>
		</div>
	);
};

export default PlaybackVolumeManager;
