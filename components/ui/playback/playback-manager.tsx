import { FunctionComponent } from 'react';
import classes from './playback-manager.module.css';
import SeekSlider from './buttons/seek-slider';
import SeekButton from './buttons/seek-button';
import PlayStopSwapper from './buttons/play-stop-button-swapper';
import { BasicPlaybackState } from 'tone';

interface PlaybackManagerProps {
	title?: string;
	onPlay: () => void;
	onStop: () => void;
	onSeek: (seekPercent: number) => void;
	seekPercentage?: number;
	playbackState?: BasicPlaybackState;
}

const PlaybackManager: FunctionComponent<PlaybackManagerProps> = ({
	title,
	onPlay,
	onStop,
	onSeek,
	seekPercentage,
	playbackState,
}) => {
	return (
		<div className={classes.playback_manager}>
			<h2 className={classes.title}>{title || 'Playback Manager'}</h2>
			<div className={classes.playback_buttons}>
				<SeekButton
					onClick={() => {
						onSeek(0);
						onStop();
					}}
				/>
				<PlayStopSwapper
					onClick={(play) => (play ? onPlay() : onStop())}
					playbackState={playbackState}
				/>
				<SeekButton
					onClick={() => {
						onSeek(1);
						onStop();
					}}
					right
				/>
			</div>
			<div className={classes.slider_container}>
				<SeekSlider onSeek={onSeek} seekPercentage={seekPercentage} />
			</div>
		</div>
	);
};

export default PlaybackManager;
