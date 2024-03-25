import { MusicPart } from '@/types/music';
import {
	getDefaultInstrumentProps,
	getInstrument,
	updateInstrument,
} from '../instruments';
import { enqueueMeasure, initializeMeasureAttributes } from './play-measure';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { getSecondsPerBeat } from '@/utils/music';
import { flattenMeasures } from '@/utils/music/measures/flatten-measures';

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
	const flattenedMeasures = flattenMeasures(measures);

	let curX = 0;
	let totalMeasuresEnqueued = 0;
	for (let i = 0; i < flattenedMeasures.length; i++) {
		const measure = flattenedMeasures[i];

		const nextMeasure = enqueueMeasure(
			measure,
			attributes,
			instrument,
			persistentAttr,
			curX,
			baseSPB,
			transport
		);

		//if (nextMeasure >= 0) i = nextMeasure - 1;
		totalMeasuresEnqueued++;

		const { beatsPerMeasure } = attributes.timeSignature;
		curX += beatsPerMeasure;
	}
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
