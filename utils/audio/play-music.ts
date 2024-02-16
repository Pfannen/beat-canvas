import * as Tone from 'tone';
import { Measure } from '@/components/providers/music/types';
import { ToneAudioNode } from 'tone';
import {
	getNoteFromYPos,
	getPitchOctaveHelper,
	getSecondsPerBeat,
} from '../music-modifier';
import { MusicScore, PitchOctaveHelper } from '@/types/music';
import { getNoteDuration } from '@/components/providers/music/utils';

// TODO: Take in time signature and instrument
export const playMeasures = (
	measures: Measure[],
	bpm: number,
	pitchOctaveHelper: PitchOctaveHelper
) => {
	const secondsPerBeat = getSecondsPerBeat(bpm);
	const now = Tone.now();
	const synth = new Tone.PolySynth(Tone.Synth).toDestination();

	for (const measure of measures) {
		for (const { x, y, type } of measure.notes) {
			const noteDuration = getNoteDuration(type, 4);
			const pitchOctave = getNoteFromYPos(y, pitchOctaveHelper);
			console.log(pitchOctave);

			synth.triggerAttackRelease(
				[pitchOctave],
				noteDuration * secondsPerBeat,
				now + x * secondsPerBeat
			);
		}
	}
};

export const ohWhatANight: Measure[] = [
	{
		notes: [
			{ x: 0, y: -6, type: 'dotted-eighth' },
			{ x: 0.75, y: -5, type: 'sixteenth' },
			{ x: 1.5, y: -4, type: 'eighth' },
			{ x: 2.25, y: -3, type: 'sixteenth' },
			{ x: 2.5, y: -3, type: 'eighth' },
			{ x: 3, y: -3, type: 'eighth' },
			{ x: 3.5, y: -4, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 4, y: -3, type: 'eighth' },
			{ x: 4.5, y: -3, type: 'sixteenth' },
			{ x: 4.75, y: -3, type: 'sixteenth' },
			{ x: 5.5, y: -2, type: 'dotted-eighth' },
			{ x: 6.25, y: -5, type: 'sixteenth' },
			{ x: 6.5, y: -9, type: 'eighth' },
			{ x: 7, y: -8, type: 'eighth' },
			{ x: 7.5, y: -7, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 8, y: -6, type: 'eighth' },
			{ x: 8.5, y: -5, type: 'sixteenth' },
			{ x: 8.75, y: -5, type: 'sixteenth' },
			{ x: 9.25, y: -4, type: 'sixteenth' },
			{ x: 9.5, y: -4, type: 'eighth' },
			{ x: 10.25, y: -3, type: 'sixteenth' },
			{ x: 10.5, y: -3, type: 'eighth' },
			{ x: 11, y: -3, type: 'eighth' },
			{ x: 11.5, y: -4, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 12, y: -3, type: 'eighth' },
			{ x: 12.5, y: -3, type: 'sixteenth' },
			{ x: 12.75, y: -3, type: 'sixteenth' },
			{ x: 13.5, y: -2, type: 'dotted-eighth' },
			{ x: 14.25, y: -2, type: 'sixteenth' },
			{ x: 14.5, y: -9, type: 'eighth' },
			{ x: 15, y: -8, type: 'eighth' },
			{ x: 15.5, y: -7, type: 'eighth' },
		],
	},
];

export const ohWhatANightScore: MusicScore = {
	title: 'Oh What a Night!',
	timeSignature: {
		beatNote: 4,
		beatsPerMeasure: 4,
	},
	beatsPerMinute: 106,
	pitchOctaveHelper: getPitchOctaveHelper('C4'),
	keySignature: 'G2',
	parts: [
		{
			instrument: 'Bass Guitar',
			id: 'P1',
			measures: ohWhatANight,
		},
	],
};
