import { MusicPart } from '@/types/music';
import {
	getDefaultInstrumentProps,
	getInstrument,
	updateInstrument,
} from '../instruments';
import { initializeMeasureAttributes, playMeasure } from './play-measure';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentNotePlayingAttributes } from '@/types/music/note-annotations';

export const playPart = (
	part: MusicPart,
	instrument: ToneInstrument,
	now: number
) => {
	const { id, instrument: instrumentName, name } = part.attributes;
	console.log(`Enqueueing part ${name} with instrument ${instrumentName}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	const persistentAttr: PersistentNotePlayingAttributes = {
		instrumentProps: getDefaultInstrumentProps(),
		velocity: 0.5,
	};
	updateInstrument(instrument, persistentAttr.instrumentProps);
	
	let curX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];

		playMeasure(measure, attributes, instrument, persistentAttr, curX, now);
		curX = (i + 1) * attributes.timeSignature.beatsPerMeasure;
	}
};
