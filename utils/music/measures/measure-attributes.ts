import {
	MeasureAttributes,
	PartialMeasureAttributes,
	TemporalMeasureAttributes,
} from '@/types/music';

export class MeasureAttributesRetriever {
	private index = 0;
	private length = 0;

	constructor(public timedMeasureAttributes?: TemporalMeasureAttributes[]) {
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
	newAttributes: PartialMeasureAttributes,
	x: number
) => {
	if (curAttributes.length === 0) {
		const attrCopy: PartialMeasureAttributes = {};
		Object.assign(attrCopy, newAttributes);
		curAttributes.push({ x, attributes: attrCopy });
		return;
	}

	let idx = 0;
	while (curAttributes.length - 1 > idx && curAttributes[idx].x <= x) idx++;

	if (curAttributes[idx].x === x) {
		Object.assign(curAttributes[idx].attributes, newAttributes);
	} else {
		const attrCopy: PartialMeasureAttributes = {};
		Object.assign(attrCopy, newAttributes);
		const timedMeasureAttributes: TemporalMeasureAttributes = {
			x,
			attributes: attrCopy,
		};
		// Insert the attributes after the one at idx
		curAttributes.splice(idx, 0, timedMeasureAttributes);
	}
};
