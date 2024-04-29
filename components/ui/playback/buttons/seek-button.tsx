import { FunctionComponent } from 'react';
import classes from './SeekButton.module.css';
import PlaybackButton from '../styles/playback-button';
import FullSeekSVG from '../../svg/full-seek-svg';

interface SeekButtonProps {
	onClick?: () => void;
	right?: boolean;
	disabled?: boolean;
}

const SeekButton: FunctionComponent<SeekButtonProps> = ({
	onClick,
	right,
	disabled = false,
}) => {
	return (
		<PlaybackButton onClick={onClick} disabled={disabled}>
			<FullSeekSVG right={right} />
		</PlaybackButton>
	);
};

export default SeekButton;
