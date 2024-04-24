import { Measure, Note } from '@/components/providers/music/types';
import { MeasureAttributes, TemporalMeasureAttributes } from '@/types/music';
import {
	DurationAttributeInfo,
	DurationAttributeInfoUpdater,
	OptionalLocationProperties,
	PartLocationInfo,
	SlurDurationInfo,
	TBCDurationAttributeInfo,
	TBCSlurDurationInfo,
	WedgeDurationInfo,
} from '@/types/music/measure-traversal';
import { initializeMeasureAttributes } from '../measure-generator';
import { getSecondsBetweenXs } from '../../time';

const updateMinMaxYPos = (info: TBCSlurDurationInfo, y: number) => {
	info.maxYPos = Math.max(info.maxYPos, y);
	info.minYPos = Math.min(info.minYPos, y);
};

const updateSlurDurationInfo: DurationAttributeInfoUpdater<'slur', 'slur'> = (
	durEntry,
	slur,
	measureIndex,
	x,
	seconds,
	note
) => {
	if (!note) return { updatedEntry: durEntry };

	let updatedEntry = durEntry;
	const completedEntries: SlurDurationInfo[] = [];
	// If a slur exists
	if (slur) {
		// If the current slur is a stop slur and there's at least 1 tbc slur
		if (slur.stop && durEntry) {
			// This stop slur *should* be a match for an existing slur, so we filter durEntry
			updatedEntry = durEntry.filter((entry) => {
				updateMinMaxYPos(entry, note.y);
				// If the entry's slur id matches one in the current slur's stop array
				if (
					slur.stop!.findIndex((stopSlurId) => stopSlurId === entry.slurId) !==
					undefined
				) {
					// We have a completed slur
					completedEntries.push({
						...entry,
						measureEndIndex: measureIndex,
						xEnd: x,
						secondsEnd: seconds,
					});
					// And we want to filter the current entry out of all the entries
					return false;
				}
				// Else since the current entry's slur id wasn't in the current slur's stop array, we keep it
				else return true;
			});
		}
		// If the current slur is a start slur, we need to add it to the entries
		if (slur.start) {
			if (!updatedEntry) updatedEntry = [];
			updatedEntry.push({
				maxYPos: note.y,
				minYPos: note.y,
				measureStartIndex: measureIndex,
				xStart: x,
				secondsStart: seconds,
				slurId: slur.start,
			});
		}
	}
	// Else since a slur doesn't exist, we need to update each tbc slur's min max ypos
	else {
		durEntry?.forEach((entry) => updateMinMaxYPos(entry, note.y));
	}

	return {
		completed: completedEntries.length ? completedEntries : undefined,
		updatedEntry: updatedEntry,
	};
};

const updateWedgeDurationInfo: DurationAttributeInfoUpdater<
	'wedge',
	'wedge'
> = (durEntry, wedge, measureIndex, x, seconds) => {
	if (!wedge) return { updatedEntry: durEntry };

	if (wedge.start) {
		return {
			updatedEntry: {
				measureStartIndex: measureIndex,
				xStart: x,
				secondsStart: seconds,
				crescendo: wedge.crescendo,
			},
		};
	} else if (durEntry) {
		const completedEntry: WedgeDurationInfo = {
			...durEntry,
			measureEndIndex: measureIndex,
			xEnd: x,
			secondsEnd: seconds,
		};

		return {
			updatedEntry: undefined,
			completed: completedEntry,
		};
	} else return { updatedEntry: durEntry };
};

const updateDurationStore = (
	durStore: TBCDurationAttributeInfo,
	measureIndex: number,
	x: number,
	seconds: number,
	optionals?: OptionalLocationProperties
): DurationAttributeInfo | null => {
	if (!optionals) return null;

	const { note, newAttributes } = optionals;
	const completedInfo: DurationAttributeInfo = {};

	// If we have a note, look for a slur
	// If we have a slur stop, there should be at least 1 slur in durStore
	// getSlurDurInfo
	// If we have a slur start, we need to add to durStore

	if (note) {
		const { updatedEntry, completed } = updateSlurDurationInfo(
			durStore.slur,
			note.annotations?.slur,
			measureIndex,
			x,
			seconds,
			note
		);
		durStore.slur = updatedEntry;
		completedInfo.slur = completed;
	}

	// If we have attributes, look for a wedge
	// If we have an ending wedge, there should be 1 wedge in durStore
	// getWedgeDurInfo
	// If we have a wedge start, we need to add to durStore

	if (newAttributes && newAttributes.wedge) {
		const { updatedEntry, completed } = updateWedgeDurationInfo(
			durStore.wedge,
			newAttributes.wedge,
			measureIndex,
			x,
			seconds
		);
		durStore.wedge = updatedEntry;
		completedInfo.wedge = completed;
	}
	if (Object.keys(completedInfo).length > 0) return completedInfo;
	else return null;
};

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
	console.time('Iterator');
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

			const locObj = createLocObj(
				attr,
				measureStartX,
				nextX,
				i,
				curSeconds,
				durStore,
				optionals
			);
			yield locObj;

			if (locObj.completedDurationAttributes)
				console.log({ dur: locObj.completedDurationAttributes });
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

	console.timeEnd('Iterator');
};
