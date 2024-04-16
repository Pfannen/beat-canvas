import { FunctionComponent } from 'react';
import classes from './PlayButton.module.css';
import PlaybackButton from './styles/playback-button';
import PlayButtonSVG from '../svg/play-button';

interface PlayButtonProps {
	onClick?: () => void;
}

const PlayButton: FunctionComponent<PlayButtonProps> = ({ onClick }) => {
	return (
		<PlaybackButton onClick={onClick}>
			<PlayButtonSVG />
		</PlaybackButton>
	);
};

export default PlayButton;
