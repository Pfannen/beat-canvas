import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import classes from './playback-button.module.css';
import AssignerButton from '../../reusable/assigner-components/assigner-button';

interface PlaybackButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
	/* onClick?: () => void;
	children?: ReactNode; */
}

const PlaybackButton: FunctionComponent<PlaybackButtonProps> = ({
	onClick,
	children,
	...props
}) => {
	return (
		<AssignerButton
			{...props}
			onClick={onClick}
			className={classes.playback_btn}
		>
			{children}
		</AssignerButton>
	);
};

export default PlaybackButton;
