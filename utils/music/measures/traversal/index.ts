import { Measure, Note } from '@/components/providers/music/types';
import { MeasureAttributes, TemporalMeasureAttributes } from '@/types/music';
import {
	OptionalLocationProperties,
	PartLocationInfo,
	TBCDurationAttributeInfo,
} from '@/types/music/measure-traversal';
import { initializeMeasureAttributes } from '../measure-generator';
import { getSecondsBetweenXs } from '../../time';
import { updateDurationStore } from './helpers';

const createLocObj = (
	currentAttributes: MeasureAttributes,
	measureStartX: number,
	curX: number,
	measureIndex: number,
	curSeconds: number,
	durStore: TBCDurationAttributeInfo,
	optionals?: OptionalLocationProperties
) => {
	const locInfo: PartLocationInfo = {
		currentAttributes,
		measureStartX,
		curX,
		measureIndex,
	};

	const completedDurInfo = updateDurationStore(
		durStore,
		measureIndex,
		curX,
		curSeconds,
		optionals
	);
	if (completedDurInfo) locInfo.completedDurationAttributes = completedDurInfo;

	if (optionals) {
		const { note, newAttributes } = optionals;
		locInfo.newAttributes = newAttributes;
		locInfo.note = note;
	}

	return locInfo;
};

// Returns information about the next location given the current state of the notes and temporal attributes
// of the some measure
const getOptionalsInfo = (
	notes: Note[],
	noteIdx: number,
	attributes: TemporalMeasureAttributes[],
	attrIdx: number
) => {
	let curAttr: TemporalMeasureAttributes | null = null;
	let curNote: Note | null = null;
	// If there's another attribute to process, store it
	if (attrIdx < attributes.length) curAttr = attributes[attrIdx];
	// If there's another note to process, store it
	if (noteIdx < notes.length) curNote = notes[noteIdx];

	// Calculate what the next x will be
	const nextX = Math.min(
		curAttr ? curAttr.x : Infinity,
		curNote ? curNote.x : Infinity
	);

	// If there is no next x (i.e. no attributes or notes to process), return null
	if (nextX === Infinity) return null;

	// Store the next attributes and / or note to process
	const optionals: OptionalLocationProperties = {};
	if (curAttr && curAttr.x === nextX) {
		optionals.newAttributes = curAttr.attributes;
		attrIdx++;
	}
	if (curNote && curNote.x === nextX) {
		optionals.note = curNote;
		noteIdx++;
	}

	// Return information about the location object to create
	return {
		optionals,
		nextX,
		noteIdx,
		attrIdx,
	};
};

export const noteAttributeGenerator = function* (
	measures: Measure[],
	initialAttributes?: MeasureAttributes
) {
	const attr = initialAttributes || initializeMeasureAttributes(measures[0]);
	const durStore: TBCDurationAttributeInfo = {};
	let curSeconds = 0;
	let measureStartX = 0;

	for (let i = 0; i < measures.length; i++) {
		// The x-value of the last location that was yielded
		let lastX = 0;
		const measure = measures[i];
		const { staticAttributes, temporalAttributes, notes } = measure;
		const tA = temporalAttributes || [];

		// Yield a loc obj for the beginning of the measure
		yield createLocObj(attr, measureStartX, 0, i, curSeconds, durStore, {
			newAttributes: staticAttributes,
		});

		let aIdx = 0;
		let nIdx = 0;

		// Go through each temporal attribute and note until there are none left for the current measure
		let optionalsInfo = getOptionalsInfo(notes, nIdx, tA, aIdx);
		// optionalsInfo will be null when there are no more notes and attributes
		while (optionalsInfo !== null) {
			const { optionals, nextX, noteIdx, attrIdx } = optionalsInfo;

			if (noteIdx === nIdx && attrIdx === aIdx) console.log('oh no...');

			aIdx = attrIdx;
			nIdx = noteIdx;

			curSeconds += getSecondsBetweenXs(
				lastX,
				nextX,
				attr.metronome,
				attr.timeSignature
			);

			yield createLocObj(
				attr,
				measureStartX,
				nextX,
				i,
				curSeconds,
				durStore,
				optionals
			);
			lastX = nextX;

			optionalsInfo = getOptionalsInfo(notes, nIdx, tA, aIdx);
		}

		// Update the number of seconds that have elapsed here to account for the measure switch
		// that occurs at the end of each measure iteration (use the beats per measure as the x)
		curSeconds += getSecondsBetweenXs(
			lastX,
			attr.timeSignature.beatsPerMeasure,
			attr.metronome,
			attr.timeSignature
		);
		measureStartX += attr.timeSignature.beatsPerMeasure;
	}
};
