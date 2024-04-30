import { ValidNotePlacements } from '@/types/modify-score/assigner';
import { getNoteTypes } from '../..';
import { NotePlacementValidator } from '@/types/modify-score';
import { SegmentSelectionData } from '@/types/modify-score/assigner/metadata';
import { NoteType } from '@/components/providers/music/types';

export const getValidNotePlacementTypes = (
	selections: SegmentSelectionData[],
	placementValidator: NotePlacementValidator,
	isDotted?: true
): ValidNotePlacements => {
	if (selections.length === 0) return new Set();

	// Store if at least 1 selection contains a note - used for noting that a note can be removed
	let hasNote = false;
	// Get an array of all note types
	// NOTE: These are sorted in decreasing order of duration
	const noteTypes = getNoteTypes();
	// Store the index of the largest note type we can fit
	let largestValidIdx = 0;

	// Iterate through each selection
	for (let i = 0; i < selections.length; i++) {
		// Extract the variables needed
		const {
			rollingAttributes: { timeSignature },
			xStart,
			measureNotes,
			note,
		} = selections[i];

		if (note) hasNote = true;
		// Loop while there are still note types left and we can't place the current largest
		// note type at our current x position
		while (
			largestValidIdx < noteTypes.length &&
			placementValidator(
				measureNotes,
				xStart,
				noteTypes[largestValidIdx],
				timeSignature
			) === -1
		) {
			// If we can't place the note at the current x, increment the largest valid index
			largestValidIdx++;
		}
	}

	// If no note type can fit, return an empty set or one with 'r' noting only notes can be removed
	if (largestValidIdx >= noteTypes.length) {
		const set = new Set() as ValidNotePlacements;
		if (hasNote) set.add('r');
		return set;
	}
	// Else there exists some note types that can fit all selections, and a set
	// of them is returned for easy lookup, along with 'r' if notes can also be removed
	else {
		const set = new Set(
			noteTypes.slice(largestValidIdx)
		) as ValidNotePlacements;
		if (hasNote) set.add('r');
		return set;
	}
};

const noteTypes = getNoteTypes();
export const getLargestValidNoteType = (
	startNoteTypeIdx: number,
	placementValidator: NotePlacementValidator,
	selectionData: SegmentSelectionData
) => {
	if (startNoteTypeIdx >= noteTypes.length) return noteTypes.length;

	let noteTypeIdx = startNoteTypeIdx;
	const { measureNotes, xStart, rollingAttributes } = selectionData;
	while (
		noteTypeIdx < noteTypes.length &&
		placementValidator(
			measureNotes,
			xStart,
			noteTypes[noteTypeIdx],
			rollingAttributes.timeSignature
		) === -1
	) {
		// If we can't place the note at the current x, increment the largest valid index
		noteTypeIdx++;
	}

	if (noteTypeIdx >= noteTypes.length) return noteTypes.length;
	else return noteTypeIdx;
};

export const getValidNotePlacementSet = (
	noteTypeIdx: number,
	notesSelected = false
) => {
	// If no note type can fit, return an empty set or one with 'r' noting only notes can be removed
	if (noteTypeIdx >= noteTypes.length) {
		const set = new Set() as ValidNotePlacements;
		if (notesSelected) set.add('r');
		return set;
	}
	// Else there exists some note types that can fit all selections, and a set
	// of them is returned for easy lookup, along with 'r' if notes can also be removed
	else {
		const set = new Set(noteTypes.slice(noteTypeIdx)) as ValidNotePlacements;
		if (notesSelected) set.add('r');
		return set;
	}
};
