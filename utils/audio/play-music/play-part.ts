import { MusicPart } from '@/types/music';
import { getInstrument } from '../instruments';
import { initializeMeasureAttributes, playMeasure } from './play-measure';

export const playPart = (part: MusicPart, now: number) => {
	const { id, instrument, name } = part.attributes;
	const toneInstrument = getInstrument(instrument);
	console.log(`Enqueueing part ${name} with instrument ${instrument}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	let curX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		playMeasure(measure, attributes, toneInstrument, curX, now);

		curX = (i + 1) * attributes.timeSignature.beatsPerMeasure;
	}
};
