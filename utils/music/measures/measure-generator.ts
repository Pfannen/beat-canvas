import { Measure, Note } from '@/components/providers/music/types';
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

/* export const measureListGenerator = function* (measures: Measure[]) {
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
}; */

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

type YieldObj = {
	currentAttributes: MeasureAttributes;
	measureStartX: number;
	curX: number;
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

export const noteAttributeGenerator = function* (
	measures: Measure[],
	initialAttributes?: MeasureAttributes
) {
	const attr = initialAttributes || initializeMeasureAttributes(measures[0]);

	let measureStartX = 0;
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		const { staticAttributes, temporalAttributes: tA, notes } = measure;

		if (staticAttributes) {
			const yieldObj: YieldObj = {
				currentAttributes: attr,
				measureStartX,
				curX: 0,
			};
			updateAttributeYieldObj(yieldObj, attr, staticAttributes, 0);
			yield yieldObj;
		}

		let aIdx = 0;
		const aLen = tA?.length || 0;
		let nIdx = 0;
		const nLen = notes?.length || 0;

		while (aIdx < aLen && nIdx < nLen) {
			const yieldObj: YieldObj = {
				currentAttributes: attr,
				measureStartX,
				curX: 0,
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
			};
			const note = notes[nIdx];
			updateNoteYieldObj(yieldObj, note);
			yield yieldObj;

			nIdx++;
		}

		measureStartX += attr.timeSignature.beatsPerMeasure;
	}
};
