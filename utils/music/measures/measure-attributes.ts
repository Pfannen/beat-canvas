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
const getTemporalAttributesAtX = (measure: Measure, x: number) => {
	const { temporalAttributes: tA } = measure;
	if (!tA) return null;

	let i = 0;
	while (i < tA.length && tA[i].x < x) i++;
	if (i < tA.length && tA[i].x === x) return tA[i].attributes;
	else return null;
};

export const getMeasureAttributes = (
	measures: Measure[],
	curAttr?: MeasureAttributes,
	xEnd?: number
) => {
	let measureAttributes = initializeMeasureAttributes(measures[0]);
	for (const someObj of noteAttributeGenerator(measures, curAttr)) {
		measureAttributes = someObj.currentAttributes;
	}

	if (xEnd !== undefined) {
		const tA = getTemporalAttributesAtX(measures[measures.length - 1], xEnd);
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
