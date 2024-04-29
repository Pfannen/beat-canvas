import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import classes from './PlayButton.module.css';
import PlaybackButton from '../styles/playback-button';
import PlayButtonSVG from '../../svg/play-button';

interface PlayButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {}

const PlayButton: FunctionComponent<PlayButtonProps> = (props) => {
	return (
		<PlaybackButton {...props}>
			<PlayButtonSVG />
		</PlaybackButton>
	);
};

export default PlayButton;
