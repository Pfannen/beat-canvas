import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes } from '@/types/music';
import { dynamicToVelocity } from '@/utils/audio/volume';
import { MeasureAttributesRetriever } from './measure-attributes';

export const initializeMeasureAttributes = (initialMeasure: Measure) => {
	const { staticAttributes, temporalAttributes } = initialMeasure;

	const attributes: Partial<MeasureAttributes> = {};
	Object.assign(attributes, staticAttributes);

	if (
		temporalAttributes &&
		temporalAttributes.length > 0 &&
		temporalAttributes[0].x === 0
	) {
		Object.assign(attributes, temporalAttributes[0].attributes);
	}

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

export const updateMeasureAttributes = (
	currentAttributes: MeasureAttributes,
	measureAttributes?: Partial<MeasureAttributes>
) => {
	if (!measureAttributes) return;

	Object.assign(currentAttributes, measureAttributes);
};

export const measureListGenerator = function* (measures: Measure[]) {
	const currentAttributes = initializeMeasureAttributes(measures[0]);

	let curX = 0;
	let totalMeasuresEnqueued = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];

		for (const { note, newAttributes } of measureGenerator(
			measure,
			currentAttributes
		)) {
			yield { note, currentAttributes, curX, measureNumber: i, newAttributes };
		}

		//if (nextMeasure >= 0) i = nextMeasure - 1;
		totalMeasuresEnqueued++;

		const { beatsPerMeasure } = currentAttributes.timeSignature;
		curX += beatsPerMeasure;
	}
};

export const measureGenerator = function* (
	measure: Measure,
	currentAttributes: MeasureAttributes
) {
	updateMeasureAttributes(currentAttributes, measure.staticAttributes);

	const attrHelper = new MeasureAttributesRetriever(measure.temporalAttributes);
	let newAttributes: Partial<MeasureAttributes> | undefined =
		attrHelper.getNextAttributes(0);
	if (newAttributes) Object.assign(newAttributes, measure.staticAttributes);
	updateMeasureAttributes(currentAttributes, newAttributes);

	const { notes } = measure;
	for (const note of notes) {
		newAttributes = attrHelper.getNextAttributes(note.x);
		updateMeasureAttributes(currentAttributes, newAttributes);

		yield { note, currentAttributes, newAttributes };
	}

	newAttributes = attrHelper.getNextAttributes(
		currentAttributes.timeSignature.beatsPerMeasure
	);
	updateMeasureAttributes(currentAttributes, newAttributes);
};
