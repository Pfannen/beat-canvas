import * as Tone from 'tone';
import { Measure } from '@/components/providers/music/types';
import { getNoteFromYPos, getSecondsPerBeat } from '../music';
import { MusicScore } from '@/types/music';
import { getNoteDuration } from '@/components/providers/music/utils';

// TODO: Take in instrument, extract measure attributes
export const playMeasures = (measures: Measure[]) => {
	const now = Tone.now();
	const synth = new Tone.PolySynth(Tone.Synth).toDestination();

	let curX = 0;
	// TODO: Extract measure attributes from current measure to use and make guarnteed measure attributes type
	const { attributes } = measures[0];
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];

		const secondsPerBeat = getSecondsPerBeat(
			attributes?.metronome?.beatsPerMinute || 60
		);

		for (const { x, y, type } of measure.notes) {
			const noteDuration = getNoteDuration(type, 4);
			const pitchOctave = getNoteFromYPos(y, attributes!.clef!);
			console.log(pitchOctave);

			synth.triggerAttackRelease(
				[pitchOctave],
				noteDuration * secondsPerBeat,
				now + (curX + x) * secondsPerBeat
			);
		}
		curX = (i + 1) * 4;
	}
};

export const ohWhatANight: Measure[] = [
	{
		attributes: {
			metronome: {
				beatNote: 4,
				beatsPerMinute: 106,
			},
			timeSignature: {
				beatNote: 4,
				beatsPerMeasure: 4,
			},
			keySignature: 'do not have functionality rn',
			clef: 'bass',
		},
		notes: [
			{ x: 0, y: 4, type: 'dotted-eighth' },
			{ x: 0.75, y: 5, type: 'sixteenth' },
			{ x: 1.5, y: 6, type: 'eighth' },
			{ x: 2.25, y: 7, type: 'sixteenth' },
			{ x: 2.5, y: 7, type: 'eighth' },
			{ x: 3, y: 7, type: 'eighth' },
			{ x: 3.5, y: 6, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 0, y: 7, type: 'eighth' },
			{ x: 0.5, y: 7, type: 'sixteenth' },
			{ x: 0.75, y: 7, type: 'sixteenth' },
			{ x: 1.5, y: 8, type: 'dotted-eighth' },
			{ x: 2.25, y: 5, type: 'sixteenth' },
			{ x: 2.5, y: 1, type: 'eighth' },
			{ x: 3, y: 2, type: 'eighth' },
			{ x: 3.5, y: 3, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 0, y: 4, type: 'eighth' },
			{ x: 0.5, y: 5, type: 'sixteenth' },
			{ x: 0.75, y: 5, type: 'sixteenth' },
			{ x: 1.25, y: 6, type: 'sixteenth' },
			{ x: 1.5, y: 6, type: 'eighth' },
			{ x: 2.25, y: 7, type: 'sixteenth' },
			{ x: 2.5, y: 7, type: 'eighth' },
			{ x: 3, y: 7, type: 'eighth' },
			{ x: 3.5, y: 6, type: 'eighth' },
		],
	},
	{
		notes: [
			{ x: 0, y: 7, type: 'eighth' },
			{ x: 0.5, y: 7, type: 'sixteenth' },
			{ x: 0.75, y: 7, type: 'sixteenth' },
			{ x: 1.5, y: 8, type: 'dotted-eighth' },
			{ x: 2.25, y: 8, type: 'sixteenth' },
			{ x: 2.5, y: 1, type: 'eighth' },
			{ x: 3, y: 2, type: 'eighth' },
			{ x: 3.5, y: 3, type: 'eighth' },
		],
	},
];

export const ohWhatANightScore: MusicScore = {
	title: 'Oh What a Night!',
	parts: [
		{
			instrument: 'Bass Guitar',
			id: 'P1',
			measures: ohWhatANight,
		},
	],
};
