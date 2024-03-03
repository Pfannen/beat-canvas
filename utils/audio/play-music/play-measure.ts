import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes } from '@/types/music';
import { Synth } from 'tone';
import { playNote } from './play-note';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentNotePlayingAttributes } from '@/types/music/note-annotations';
import { MeasureAttributesRetriever } from '@/utils/music/measure-attributes';
import { dynamicToVelocity } from '../volume';

export const initializeMeasureAttributes = (initialMeasure: Measure) => {
	const attributes = initialMeasure.attributes
		? initialMeasure.attributes[0].attributes
		: {};

	const metronome = attributes.metronome || {
		beatNote: 4,
		beatsPerMinute: 105,
	};
	const timeSignature = attributes.timeSignature || {
		beatNote: 4,
		beatsPerMeasure: 4,
	};
	const keySignature = attributes.keySignature || '0';
	const clef = attributes.clef || 'treble';
	const dynamic = attributes.dynamic || 'mp';
	return {
		metronome,
		timeSignature,
		keySignature,
		clef,
		dynamic,
	} as MeasureAttributes;
};

const updateMeasureAttributes = (
	currentAttributes: MeasureAttributes,
	measureAttributes?: Partial<MeasureAttributes>
) => {
	if (!measureAttributes) return;

	Object.assign(currentAttributes, measureAttributes);

	/* // TODO: Remove never cast
	const keys = Object.keys(measureAttributes) as (keyof MeasureAttributes)[];
	for (const key of keys) {
		if (measureAttributes[key])
			currentAttributes[key] = measureAttributes[key] as never;
	} */
};

export const playMeasure = (
	measure: Measure,
	currentAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentNotePlayingAttributes,
	curX: number,
	now: number
) => {
	const attrHelper = new MeasureAttributesRetriever(measure.attributes);
	updateMeasureAttributes(currentAttributes, attrHelper.getNextAttributes(0));

	const { notes } = measure;
	for (const note of notes) {
		updateMeasureAttributes(
			currentAttributes,
			attrHelper.getNextAttributes(note.x)
		);
		// Temporary, dynamics should affect volume not velocity
		persistentAttr.velocity = dynamicToVelocity(currentAttributes.dynamic);

		playNote(note, currentAttributes, instrument, persistentAttr, curX, now);
	}

	updateMeasureAttributes(
		currentAttributes,
		attrHelper.getNextAttributes(
			curX + currentAttributes.timeSignature.beatsPerMeasure
		)
	);
};
