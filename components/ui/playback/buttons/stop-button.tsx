import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import classes from './StopButton.module.css';
import PlaybackButton from '../styles/playback-button';
import StopButtonSVG from '../../svg/stop-button-svg';

interface StopButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {}

const StopButton: FunctionComponent<StopButtonProps> = (props) => {
	return (
		<PlaybackButton {...props}>
			<StopButtonSVG />
		</PlaybackButton>
	);
};

export default StopButton;
