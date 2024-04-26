import { FunctionComponent } from 'react';
import classes from './StopButton.module.css';
import PlaybackButton from '../styles/playback-button';
import StopButtonSVG from '../../svg/stop-button-svg';

interface StopButtonProps {
	onClick?: () => void;
}

const StopButton: FunctionComponent<StopButtonProps> = ({ onClick }) => {
	return (
		<PlaybackButton onClick={onClick}>
			<StopButtonSVG />
		</PlaybackButton>
	);
};

export default StopButton;
