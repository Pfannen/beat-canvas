'use client';

import { FunctionComponent } from 'react';
import classes from './AudioTest.module.css';
import TaskbarButton from '@/components/ui/taskbar/buttons/taskbar-button';
import { ohWhatANight, playMeasures } from '@/utils/audio/play-music';
import { PitchOctaveHelper } from '@/types/music';
import { getPitchOctaveHelper } from '@/utils/music-modifier';
import { polySynth } from '@/utils/audio/instruments';

interface AudioTestProps {}

const pitchOctaveHelper: PitchOctaveHelper = getPitchOctaveHelper('C4');

const AudioTest: FunctionComponent<AudioTestProps> = () => {
	return (
		<>
			<TaskbarButton
				onClick={playMeasures.bind(null, ohWhatANight, 106, pitchOctaveHelper)}
			>
				Play
			</TaskbarButton>
		</>
	);
};

export default AudioTest;
