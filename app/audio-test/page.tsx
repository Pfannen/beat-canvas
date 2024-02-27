'use client';

import { FunctionComponent } from 'react';
import classes from './AudioTest.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import {
	ohWhatANight,
	ohWhatANightScore,
	playMusicScore,
} from '@/utils/audio/play-music/play-music';

interface AudioTestProps {}

const AudioTest: FunctionComponent<AudioTestProps> = () => {
	return (
		<>
			<TaskbarButton onClick={playMusicScore.bind(null, ohWhatANightScore)}>
				Play
			</TaskbarButton>
		</>
	);
};

export default AudioTest;
