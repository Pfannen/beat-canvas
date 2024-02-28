import { Volume, now } from 'tone';
import { Measure } from '@/components/providers/music/types';
import { MusicScore } from '@/types/music';
import { playPart } from './play-part';
import { getInstrument } from '../instruments';
import { ToneInstrumentSpecifier } from '@/types/audio/instrument';
import { ScoreVolumeManager } from '../ScoreVolumeManager';

// TODO: Look into multiple parts not each specifying metronome
export const playMusicScore = (score: MusicScore) => {
	const { title, parts } = score;
	console.log('Now playing: ' + title);

	const masterVolume = new Volume(6).toDestination();

	const instruments: ToneInstrumentSpecifier[] = [];

	// Make sure there's enough time to queue all the parts up
	const musicStart = now() + parts.length * 0.2;
	for (const part of parts) {
		const { attributes } = part;
		const instrument = getInstrument(attributes.instrument, masterVolume);

		playPart(part, instrument, musicStart);

		instruments.push({ id: part.attributes.id, instrument });
	}

	ScoreVolumeManager.setInstruments(title, instruments, masterVolume);
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
			keySignature: 0,
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
			attributes: {
				instrument: 'Bass Guitar',
				id: 'P1',
				name: 'Bass Guitar',
			},
			measures: ohWhatANight,
		},
	],
};
