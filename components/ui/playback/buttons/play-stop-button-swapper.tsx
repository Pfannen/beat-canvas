import { FunctionComponent } from 'react';
import classes from './PlayStopSwapper.module.css';
import { BasicPlaybackState } from 'tone';
import StopButton from './stop-button';
import PlayButton from './play-button';

interface PlayStopSwapperProps {
	onClick?: (play: boolean) => void;
	playbackState?: BasicPlaybackState;
}

const PlayStopSwapper: FunctionComponent<PlayStopSwapperProps> = ({
	onClick,
	playbackState,
}) => {
	if (playbackState === 'started')
		return <StopButton onClick={onClick && onClick.bind(null, false)} />;
	else return <PlayButton onClick={onClick && onClick.bind(null, true)} />;
};

export default PlayStopSwapper;
