import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes } from '@/types/music';
import { enqueueNote, playNote } from './play-note';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { MeasureAttributesRetriever } from '@/utils/music/measure-attributes';
import { dynamicToVelocity } from '../volume';
import { EnqueueDetails } from '@/types/audio/play-music';

export const initializeMeasureAttributes = (initialMeasure: Measure) => {
	const attributes = initialMeasure.attributes
		? initialMeasure.attributes[0].attributes
		: {};

	const metronome = attributes.metronome || {
		beatNote: 4,
		beatsPerMinute: 103,
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
	persistentAttr: PersistentInstrumentAttributes,
	curX: number,
	now: number,
	enqueue?: EnqueueDetails
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

		if (enqueue) {
			enqueueNote(
				note,
				currentAttributes,
				instrument,
				persistentAttr,
				curX,
				enqueue.baseSPB,
				enqueue.transport
			);
		} else {
			playNote(note, currentAttributes, instrument, persistentAttr, curX, now);
		}
	}

	updateMeasureAttributes(
		currentAttributes,
		attrHelper.getNextAttributes(
			currentAttributes.timeSignature.beatsPerMeasure
		)
	);
};
