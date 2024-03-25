import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, Repeat } from '@/types/music';
import { enqueueNote } from './play-note';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { MeasureAttributesRetriever } from '@/utils/music/measures/measure-attributes';
import { dynamicToVelocity } from '../volume';
import { Transport } from 'tone/build/esm/core/clock/Transport';

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
};

const parseRepeat = (repeat?: Repeat) => {
	if (!repeat || repeat.forward) return -1;
	console.log('Parsing repeat...');

	if (repeat.remainingRepeats === 0) {
		repeat.remainingRepeats = repeat.repeatCount;
		return -1;
	} else {
		repeat.remainingRepeats -= 1;
		console.log('Jump to measure ' + repeat.jumpMeasure);
		return repeat.jumpMeasure;
	}
};

export const enqueueMeasure = (
	measure: Measure,
	currentAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentInstrumentAttributes,
	curX: number,
	baseSPB: number,
	transport: Transport
) => {
	const attrHelper = new MeasureAttributesRetriever(measure.attributes);
	let newAttributes = attrHelper.getNextAttributes(0);
	updateMeasureAttributes(currentAttributes, newAttributes);

	const { notes } = measure;
	for (const note of notes) {
		newAttributes = attrHelper.getNextAttributes(note.x);
		updateMeasureAttributes(currentAttributes, newAttributes);

		// Temporary, dynamics should affect volume not velocity
		persistentAttr.velocity = dynamicToVelocity(currentAttributes.dynamic);

		enqueueNote(
			note,
			currentAttributes,
			instrument,
			persistentAttr,
			curX,
			baseSPB,
			transport
		);
	}

	newAttributes = attrHelper.getNextAttributes(
		currentAttributes.timeSignature.beatsPerMeasure
	);
	updateMeasureAttributes(currentAttributes, newAttributes);

	//return parseRepeat(newAttributes?.repeat);
};

/* export const playMeasure = (
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
}; */
