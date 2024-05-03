import { Measure, Note } from '@/components/providers/music/types';
import {
	MeasureAttributes,
	TemporalMeasureAttributes,
	getDurationMeasureAttributes,
} from '@/types/music';
import { deepyCopy } from '@/utils';

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

const durAttrs = getDurationMeasureAttributes();
const clearDurationAttributes = (attributes: MeasureAttributes) => {
	for (const durAttr of durAttrs) {
		// For whatever reason, TS isn't complaining that we might be removing a required property
		// However, the attributes resulting from getDurationMeasureAttributes are the ones that are optional
		if (durAttr in attributes) delete attributes[durAttr];
	}
};

export const iterateAndUpdateTemporal = function* (
	attributes: MeasureAttributes,
	temporal?: TemporalMeasureAttributes[]
) {
	if (!temporal) return;

	// Iterate through them, updating the attributes
	for (let i = 0; i < temporal.length; i++) {
		const { attributes: dA } = temporal[i];
		updateMeasureAttributes(attributes, dA);
		yield attributes;
		clearDurationAttributes(attributes);
	}

	return attributes;
};

export const measureAttributeGenerator = function* (
	measures: Measure[],
	targetMeasureIndex: number,
	currentAttributes?: MeasureAttributes
) {
	// Target index can be the length of the measures if all measure should be iterated
	if (targetMeasureIndex > measures.length) return;

	// Store the attributes
	const attributes = currentAttributes
		? deepyCopy(currentAttributes)
		: initializeMeasureAttributes(measures[0]);

	// Iterate through each measure, up until the target measure
	for (let i = 0; i < targetMeasureIndex; i++) {
		const measure = measures[i];
		const { staticAttributes: sA, temporalAttributes: tA } = measure;
		// Update the attributes with the current measure's static attributes
		updateMeasureAttributes(attributes, sA);
		yield attributes;
		for (const _ of iterateAndUpdateTemporal(attributes, tA)) {
			yield attributes;
		}
	}

	// If there was a target measure
	if (targetMeasureIndex < measures.length) {
		// Get the static attributes and temporal attributes at x 0 (if they exist) and update
		// the attributes with them
		const { staticAttributes: sA, temporalAttributes: tA } =
			measures[targetMeasureIndex];

		updateMeasureAttributes(attributes, sA);
		if (tA && tA[0].x === 0)
			updateMeasureAttributes(attributes, tA[0].attributes);

		yield attributes;
	}
};
