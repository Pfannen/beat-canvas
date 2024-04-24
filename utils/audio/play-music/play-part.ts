import { MusicPart } from '@/types/music';
import {
	getDefaultInstrumentProps,
	getInstrument,
	updateInstrument,
} from '../instruments';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { getSecondsPerBeat } from '@/utils/music';
import { expandMeasures } from '@/utils/music/measures/expand-measures';
import { initializeMeasureAttributes } from '@/utils/music/measures/measure-generator';
import { enqueueNote } from './play-note';
import { dynamicToVelocity } from '../volume';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';

export const enqueuePart = (
	part: MusicPart,
	instrument: ToneInstrument,
	transport: Transport
) => {
	const { id, instrument: instrumentName, name } = part.attributes;
	console.log(`Enqueueing part ${name} with instrument ${instrumentName}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	const persistentAttr: PersistentInstrumentAttributes = {
		instrumentProps: getDefaultInstrumentProps(),
		velocity: 0.5,
	};
	updateInstrument(instrument, persistentAttr.instrumentProps);

	const baseSPB = getSecondsPerBeat(attributes.metronome.beatsPerMinute);
	const expandedMeasures = expandMeasures(measures);

	for (const {
		currentAttributes,
		newAttributes,
		note,
		measureStartX,
	} of noteAttributeGenerator(expandedMeasures)) {
		persistentAttr.velocity = dynamicToVelocity(currentAttributes.dynamic);

		if (note) {
			enqueueNote(
				note,
				currentAttributes,
				instrument,
				persistentAttr,
				measureStartX,
				baseSPB,
				transport
			);
		}
	}

	/* let curX = 0;
	let totalMeasuresEnqueued = 0;
	for (let i = 0; i < expandedMeasures.length; i++) {
		const measure = expandedMeasures[i];

		enqueueMeasure(
			measure,
			attributes,
			instrument,
			persistentAttr,
			curX,
			baseSPB,
			transport
		);

		totalMeasuresEnqueued++;

		const { beatsPerMeasure } = attributes.timeSignature;
		curX += beatsPerMeasure;
	} */
};

/* export const playPart = (
	part: MusicPart,
	instrument: ToneInstrument,
	now: number,
	transport?: Transport
) => {
	const { id, instrument: instrumentName, name } = part.attributes;
	console.log(`Enqueueing part ${name} with instrument ${instrumentName}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	const persistentAttr: PersistentInstrumentAttributes = {
		instrumentProps: getDefaultInstrumentProps(),
		velocity: 0.5,
	};
	updateInstrument(instrument, persistentAttr.instrumentProps);

	const enqueueDetails: EnqueueDetails | undefined = transport && {
		baseSPB: getSecondsPerBeat(attributes.metronome.beatsPerMinute),
		transport,
	};

	let curX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];

		playMeasure(
			measure,
			attributes,
			instrument,
			persistentAttr,
			curX,
			now,
			enqueueDetails
		);
		curX = (i + 1) * attributes.timeSignature.beatsPerMeasure;
	}
}; */
