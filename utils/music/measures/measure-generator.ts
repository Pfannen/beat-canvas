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

export type YieldObj = {
	currentAttributes: MeasureAttributes;
	measureStartX: number;
	curX: number;
	measureIndex: number;
	newAttributes?: Partial<MeasureAttributes>;
	note?: Note;
};

const updateAttributeYieldObj = (
	yieldObj: YieldObj,
	currentAttr: MeasureAttributes,
	newAttr: Partial<MeasureAttributes>,
	x: number
) => {
	updateMeasureAttributes(currentAttr, newAttr);
	yieldObj.curX = x;
	yieldObj.newAttributes = newAttr;
};

const updateNoteYieldObj = (yieldObj: YieldObj, note: Note) => {
	yieldObj.curX = note.x;
	yieldObj.note = note;
};

// TODO: Make a measure attribute generator
export const noteAttributeGenerator = function* (
	measures: Measure[],
	initialAttributes?: MeasureAttributes
) {
	const attr = initialAttributes || initializeMeasureAttributes(measures[0]);

	let measureStartX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		const { staticAttributes, temporalAttributes: tA, notes } = measure;

		// NOTE: Currently need this so every measure has an object yielded
		// Can change in the future if we construct a measure attribute generator
		const measureStartObj: YieldObj = {
			currentAttributes: attr,
			measureStartX,
			curX: 0,
			measureIndex: i,
		};
		if (staticAttributes) {
			updateAttributeYieldObj(measureStartObj, attr, staticAttributes, 0);
		}
		yield measureStartObj;

		let aIdx = 0;
		const aLen = tA?.length || 0;
		let nIdx = 0;
		const nLen = notes?.length || 0;

		while (aIdx < aLen && nIdx < nLen) {
			const yieldObj: YieldObj = {
				currentAttributes: attr,
				measureStartX,
				curX: 0,
				measureIndex: i,
			};
			const newAttr = tA![aIdx];
			const note = notes[nIdx];

			if (newAttr.x < note.x) {
				updateAttributeYieldObj(yieldObj, attr, newAttr.attributes, newAttr.x);
				yield yieldObj;
				aIdx++;
			} else if (newAttr.x > note.x) {
				updateNoteYieldObj(yieldObj, note);
				yield yieldObj;
				nIdx++;
			} else {
				updateAttributeYieldObj(yieldObj, attr, newAttr.attributes, newAttr.x);
				updateNoteYieldObj(yieldObj, note);
				yield yieldObj;

				aIdx++;
				nIdx++;
			}
		}

		while (aIdx < aLen) {
			const yieldObj: YieldObj = {
				currentAttributes: attr,
				measureStartX,
				curX: 0,
				measureIndex: i,
			};
			const newAttr = tA![aIdx];
			updateAttributeYieldObj(yieldObj, attr, newAttr.attributes, newAttr.x);
			yield yieldObj;

			aIdx++;
		}

		while (nIdx < nLen) {
			const yieldObj: YieldObj = {
				currentAttributes: attr,
				measureStartX,
				curX: 0,
				measureIndex: i,
			};
			const note = notes[nIdx];
			updateNoteYieldObj(yieldObj, note);
			yield yieldObj;

			nIdx++;
		}

		measureStartX += attr.timeSignature.beatsPerMeasure;
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
