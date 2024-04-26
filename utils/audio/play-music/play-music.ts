import { Offline, Player } from 'tone';
import { Measure } from '@/components/providers/music/types';
import { MusicScore } from '@/types/music';
import { enqueuePart } from './play-part';
import { getInstrument } from '../instruments';
import { ToneInstrument } from '@/types/audio/instrument';
import { EnqueuedBuffer } from '@/types/audio/play-music';
import { expandMeasures } from '@/utils/music/measures/expand-measures';
import { getMeasuresStartAndEndTime } from '@/utils/music/time/measures';

export const enqueueMusicScore = async (score: MusicScore) => {
	const { parts } = score;
	const buffers: EnqueuedBuffer[] = [];

	console.time('Loading parts...');
	for (const part of parts) {
		// Expand the measures here so we can get the total duration of the score
		const expandedMeasures = expandMeasures(part.measures);
		// Index 1 stores the time at which the last measure ends
		const [_, partDuration] = getMeasuresStartAndEndTime(expandedMeasures);
		console.log({ partDuration });

		const buffer = await Offline(
			({ transport }) => {
				const { attributes } = part;
				let instrument: ToneInstrument;

				instrument = getInstrument(attributes.instrument).toDestination();
				enqueuePart(part, instrument, transport, expandedMeasures);

				transport.start(0);
				// Record time (first argument) affects the time it takes to render by how much you move it
				// Sampling rate (last argument) plays a significant role in the time it takes to render a part
			},
			partDuration + 0.5,
			1,
			7500
		);

		buffers.push({ name: part.attributes.name, buffer });
	}
	console.timeEnd('Loading parts...');

	return buffers;
};

export const ohWhatANight: Measure[] = [
	{
		staticAttributes: {
			timeSignature: {
				beatNote: 4,
				beatsPerMeasure: 4,
			},
			keySignature: 0,
			clef: 'bass',
		},
		temporalAttributes: [
			{
				x: 0,
				attributes: {
					metronome: {
						beatNote: 4,
						beatsPerMinute: 106,
					},
				},
			},
		],
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

/* // TODO: Look into multiple parts not each specifying metronome
export const playMusicScore = (
	score: MusicScore,
	playParams: PlayParams = {}
) => {
	const { title, parts } = score;
	const { getInstrumentNode, onPlay } = playParams;
	console.log('Now playing: ' + title);
	console.log(score);

	const instruments: ToneInstrumentSpecifier[] = [];
	const musicStart = now() + 0.15;

	Transport.start();
	if (onPlay)
		Transport.scheduleOnce((time) => {
			if (onPlay) onPlay();
			console.log({ time, musicStart });
		}, 0.15);

	for (const part of parts) {
		const { attributes } = part;
		let instrument: ToneInstrument;

		if (getInstrumentNode) {
			instrument =
				getInstrumentNode(attributes.instrument) ||
				getInstrument(attributes.instrument).toDestination();
		} else {
			instrument = getInstrument(attributes.instrument).toDestination();
		}

		playPart(part, instrument, musicStart);

		instruments.push({ id: part.attributes.id, instrument });
	}

	return instruments;
}; */
