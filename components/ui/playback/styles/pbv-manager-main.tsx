import { FunctionComponent } from 'react';
import classes from './pbv-manager-main.module.css';
import PlaybackManager, { PlaybackManagerProps } from '../playback-manager';
import VolumeManager, { VolumeManagerProps } from '../volume-manager';
import MusicScoreVolumeManager, {
	MusicScoreVolumeManagerProps,
} from '../volume-manager/music-score-volume-manager';

interface PBVManagerMainProps
	extends PlaybackManagerProps,
		MusicScoreVolumeManagerProps {}

const PBVManagerMain: FunctionComponent<PBVManagerMainProps> = ({
	title,
	onPlay,
	onStop,
	onSeek,
	seekPercentage,
	playbackState,
	disableUserSliding,
	stopPlaybackOnButtonSeek,
	modifyVolume,
	musicVolumePairs,
}) => {
	return (
		<div className={classes.managers_container}>
			<PlaybackManager
				title={title}
				onPlay={onPlay}
				onStop={onStop}
				onSeek={onSeek}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
				disableUserSliding={disableUserSliding}
				stopPlaybackOnButtonSeek={stopPlaybackOnButtonSeek}
			/>
			<MusicScoreVolumeManager
				modifyVolume={modifyVolume}
				musicVolumePairs={musicVolumePairs}
			/>
		</div>
	);
};

export default PBVManagerMain;
