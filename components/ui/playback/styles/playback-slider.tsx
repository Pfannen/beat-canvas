import { FunctionComponent, InputHTMLAttributes, RefObject } from 'react';
import classes from './playback-slider.module.css';
import { concatClassNames } from '@/utils/css';

interface PlaybackSliderProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	inputRef?: RefObject<HTMLInputElement>;
}

const PlaybackSlider: FunctionComponent<PlaybackSliderProps> = ({
	inputRef,
	className,
	...props
}) => {
	return (
		<input
			type="range"
			ref={inputRef}
			className={concatClassNames(className, classes.slider)}
			{...props}
		></input>
	);
};

export default PlaybackSlider;
