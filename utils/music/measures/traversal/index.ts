import { Measure, Note } from '@/components/providers/music/types';
import { MeasureAttributes, TemporalMeasureAttributes } from '@/types/music';
import {
	OptionalLocationProperties,
	PartLocationInfo,
	RequiredLocationProperties,
	TBCDurationAttributeInfo,
} from '@/types/music/measure-traversal';
import {
	initializeMeasureAttributes,
	updateMeasureAttributes,
} from '../measure-generator';
import { getSecondsBetweenXs } from '../../time';
import { updateDurationStore } from './helpers';
import { getNoteDuration } from '@/components/providers/music/utils';
import { deepyCopy } from '@/utils';

const getLastNoteXEnd = (
	curLastNoteXEnd: number,
	curX: number,
	beatNote: number,
	note?: Note
) => {
	// chords shouldn't advance the x position, neither should no note
	if (note && !(note.annotations && note.annotations.chord)) {
		return (
			curX + getNoteDuration(note.type, beatNote, note.annotations?.dotted)
		);
	} else return curLastNoteXEnd;
};

const createLocObj = (
	durStore: TBCDurationAttributeInfo,
	curSeconds: number,
	required: RequiredLocationProperties,
	optionals?: OptionalLocationProperties,
	deepCopy?: boolean
) => {
	const locInfo: PartLocationInfo = {
		...required,
	};

	const completedDurInfo = updateDurationStore(
		durStore,
		required.measureIndex,
		required.curX,
		curSeconds,
		optionals
	);
	if (completedDurInfo) locInfo.completedDurationAttributes = completedDurInfo;

	if (optionals) Object.assign(locInfo, optionals);

	return deepCopy ? deepyCopy(locInfo) : locInfo;
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
	initialAttributes?: MeasureAttributes,
	deepCopy = false
) {
	if (!measures || !measures.length) return;
	const attr = initialAttributes
		? deepyCopy(initialAttributes)
		: initializeMeasureAttributes(measures[0]);
	const durStore: TBCDurationAttributeInfo = {};
	let curSeconds = 0;
	let measureStartX = 0;

	for (let i = 0; i < measures.length; i++) {
		// The x-value of the last location that was yielded
		let lastX = 0;
		let lastNoteXEnd = 0;
		const measure = measures[i];
		const { staticAttributes, temporalAttributes, notes } = measure;
		const tA = temporalAttributes || [];

		updateMeasureAttributes(attr, staticAttributes);
		// Yield a loc obj for the beginning of the measure
		yield createLocObj(
			durStore,
			curSeconds,
			{
				currentAttributes: attr,
				measureStartX,
				curX: 0,
				measureIndex: i,
				lastNoteXEnd,
				curSeconds,
			},
			{
				newAttributes: staticAttributes,
				measureStart: true,
			},
			deepCopy
		);

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

			updateMeasureAttributes(attr, optionals.newAttributes);
			yield createLocObj(
				durStore,
				curSeconds,
				{
					currentAttributes: attr,
					measureStartX,
					curX: nextX,
					measureIndex: i,
					lastNoteXEnd,
					curSeconds,
				},
				optionals,
				deepCopy
			);
			lastX = nextX;
			lastNoteXEnd = getLastNoteXEnd(
				lastNoteXEnd,
				nextX,
				attr.timeSignature.beatNote,
				optionals.note
			);

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

		// Yield an object for the end of a measure
		yield createLocObj(
			durStore,
			curSeconds,
			{
				currentAttributes: attr,
				measureStartX,
				curX: attr.timeSignature.beatsPerMeasure,
				measureIndex: i,
				lastNoteXEnd,
				curSeconds,
			},
			{ measureEnd: true },
			deepCopy
		);

		measureStartX += attr.timeSignature.beatsPerMeasure;
	}
};
