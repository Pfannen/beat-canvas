import {
	FunctionComponent,
	InputHTMLAttributes,
	RefObject,
	useRef,
} from 'react';
import classes from './SeekSlider.module.css';
import PlaybackSlider from '../styles/playback-slider';

type SeekSliderOmissions = 'type' | 'min' | 'max' | 'className';

interface SeekSliderProps {
	onSeek?: (seekPercent: number) => void;
	seekPercentage?: number;
}

const SeekSlider: FunctionComponent<SeekSliderProps> = ({
	onSeek,
	seekPercentage,
}) => {
	const isSeekingRef = useRef<boolean>(false);
	const seekRef = useRef<HTMLInputElement>(null);

	const seek = (pct: number) => {
		isSeekingRef.current = false;
		if (onSeek) onSeek(pct);
	};

	if (
		seekRef.current &&
		!isSeekingRef.current &&
		seekPercentage !== undefined
	) {
		seekRef.current.value = seekPercentage.toString();
	}

	return (
		<PlaybackSlider
			min="0"
			max="1"
			step={0.001}
			defaultValue={0}
			onMouseDown={() => (isSeekingRef.current = true)}
			onTouchStart={() => (isSeekingRef.current = true)}
			onMouseUp={(event) => seek(+event.currentTarget.value)}
			onTouchEnd={(event) => seek(+event.currentTarget.value)}
			inputRef={seekRef}
		/>
	);
};

export default SeekSlider;
