import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes } from '@/types/music';
import { Synth } from 'tone';
import { playNote } from './play-note';
import { ToneInstrument } from '@/types/audio/instrument';

export const initializeMeasureAttributes = (initialMeasure: Measure) => {
	const { attributes } = initialMeasure;
	const metronome = attributes?.metronome || {
		beatNote: 4,
		beatsPerMinute: 105,
	};
	const timeSignature = attributes?.timeSignature || {
		beatNote: 4,
		beatsPerMeasure: 4,
	};
	const keySignature = attributes?.keySignature || '0';
	const clef = attributes?.clef || 'treble';
	return {
		metronome,
		timeSignature,
		keySignature,
		clef,
	} as MeasureAttributes;
};

const updateMeasureAttributes = (
	currentAttributes: MeasureAttributes,
	measureAttributes?: Partial<MeasureAttributes>
) => {
	if (!measureAttributes) return;

	// TODO: Remove never cast
	const keys = Object.keys(measureAttributes) as (keyof MeasureAttributes)[];
	for (const key of keys) {
		if (measureAttributes[key])
			currentAttributes[key] = measureAttributes[key] as never;
	}
};

export const playMeasure = (
	measure: Measure,
	currentAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	curX: number,
	now: number
) => {
	updateMeasureAttributes(currentAttributes, measure.attributes);

	const { notes } = measure;
	for (const note of notes) {
		playNote(note, currentAttributes, instrument, curX, now);
	}
};
