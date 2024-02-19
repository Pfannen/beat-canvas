'use client';

import { FunctionComponent } from 'react';
import classes from './AudioTest.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import { ohWhatANight, playMeasures } from '@/utils/audio/play-music';

interface AudioTestProps {}

const AudioTest: FunctionComponent<AudioTestProps> = () => {
	return (
		<>
			<TaskbarButton onClick={playMeasures.bind(null, ohWhatANight)}>
				Play
			</TaskbarButton>
		</>
	);
};

export default AudioTest;
