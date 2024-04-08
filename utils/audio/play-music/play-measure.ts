import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, Repeat } from '@/types/music';
import { enqueueNote } from './play-note';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { MeasureAttributesRetriever } from '@/utils/music/measures/measure-attributes';
import { dynamicToVelocity } from '../volume';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import {
	measureGenerator,
	updateMeasureAttributes,
} from '@/utils/music/measures/measure-generator';

export const enqueueMeasure = (
	measure: Measure,
	currentAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentInstrumentAttributes,
	curX: number,
	baseSPB: number,
	transport: Transport
) => {
	for (const { note, newAttributes } of measureGenerator(
		measure,
		currentAttributes
	)) {
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
	console.log(measure.staticAttributes?.timeSignature?.beatsPerMeasure);
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
