import { MusicPart } from '@/types/music';
import { getInstrument } from '../instruments';
import { initializeMeasureAttributes, playMeasure } from './play-measure';
import { ToneInstrument } from '@/types/audio/instrument';

export const playPart = (
	part: MusicPart,
	instrument: ToneInstrument,
	now: number
) => {
	const { id, instrument: instrumentName, name } = part.attributes;
	console.log(`Enqueueing part ${name} with instrument ${instrumentName}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	let curX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		playMeasure(measure, attributes, instrument, curX, now);

		curX = (i + 1) * attributes.timeSignature.beatsPerMeasure;
	}
};
