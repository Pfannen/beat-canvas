import { Measure } from '@/components/providers/music/types';
import {
	DynamicMeasureAttributes,
	MeasureAttributes,
	PartialMeasureAttributes,
	StaticMeasureAttributes,
	TemporalMeasureAttributes,
	staticMeasureAttributesKeys,
} from '@/types/music';
import {
	initializeMeasureAttributes,
	noteAttributeGenerator,
} from './measure-generator';

export class MeasureAttributesRetriever {
	private index = 0;
	private length = 0;

	constructor(private timedMeasureAttributes?: TemporalMeasureAttributes[]) {
		if (timedMeasureAttributes) this.length = timedMeasureAttributes.length;
	}

	getNextAttributes(curX: number) {
		if (this.index >= this.length) return;

		const nextAttributes = this.timedMeasureAttributes![this.index];
		if (nextAttributes.x <= curX) return nextAttributes.attributes;
	}
}

export const assignTemporalMeasureAttributes = (
	curAttributes: TemporalMeasureAttributes[],
	newAttributes: Partial<DynamicMeasureAttributes>,
	x: number
) => {
	if (Object.keys(newAttributes).length === 0) return;

	if (curAttributes.length === 0) {
		const attrCopy: Partial<DynamicMeasureAttributes> = {};
		Object.assign(attrCopy, newAttributes);
		curAttributes.push({ x, attributes: attrCopy });
		return;
	}

	let idx = 0;
	while (curAttributes.length - 1 > idx && curAttributes[idx].x <= x) idx++;

	if (curAttributes[idx].x === x) {
		Object.assign(curAttributes[idx].attributes, newAttributes);
	} else {
		const attrCopy: Partial<DynamicMeasureAttributes> = {};
		Object.assign(attrCopy, newAttributes);
		const timedMeasureAttributes: TemporalMeasureAttributes = {
			x,
			attributes: attrCopy,
		};
		// Insert the attributes after the one at idx
		curAttributes.splice(idx, 0, timedMeasureAttributes);
	}
};

// TODO: Use binary search
export const getTemporalAttributesAtX = (measure: Measure, x: number) => {
	const { temporalAttributes: tA } = measure;
	if (!tA) return null;

	let i = 0;
	while (i < tA.length && tA[i].x < x) i++;
	if (i < tA.length && tA[i].x === x) return tA[i].attributes;
	else return null;
};

// 'measures' should be all the measures prior to the target measure where you don't have
// measure attributes for
// 'curAttr' are the attributes of the first measure in the array
export const getMeasureAttributes = (
	measures: Measure[],
	targetMeasureIndex: number,
	curAttr?: MeasureAttributes,
	xEnd?: number
) => {
	// Check if given target index is valid
	if (targetMeasureIndex >= measures.length || targetMeasureIndex < 0)
		return null;

	// Create a variable to store measure attributes
	let measureAttributes: MeasureAttributes | null = null;
	// Iterate through the measures, initially using curAttr if present
	for (const scoreLocDetails of noteAttributeGenerator(measures, curAttr)) {
		// If we've reached the target index, assign the local attribute variable
		// and break (don't need to iterate through the remaining measures)
		if (scoreLocDetails.measureIndex === targetMeasureIndex) {
			measureAttributes = scoreLocDetails.currentAttributes;
			break;
		}
	}

	// If for some reason we didn't reach the target measure, return null
	if (!measureAttributes) return null;
	// If we need the temporal attributes, get them and assign them to the current attributes
	if (xEnd !== undefined) {
		const tA = getTemporalAttributesAtX(measures[targetMeasureIndex], xEnd);
		if (tA) Object.assign(measureAttributes, tA);
	}

	return measureAttributes;
};

export const getPartialMeasureAttributes = (measure: Measure, x = 0) => {
	const partialMA: Partial<MeasureAttributes> = {};
	if (measure.staticAttributes)
		Object.assign(partialMA, measure.staticAttributes);
	const tA = getTemporalAttributesAtX(measure, x);
	if (tA) Object.assign(partialMA, tA);

	return partialMA;
};
