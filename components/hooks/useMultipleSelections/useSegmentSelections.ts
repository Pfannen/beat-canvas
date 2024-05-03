import { DottedValidator, ScoreSegmentID } from '@/types/modify-score';
import { useSelections } from '.';
import { SegmentSelectionData } from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';
import { Measure } from '@/components/providers/music/types';

export const useSegmentSelections = (allowStackedNotes: boolean) => {
	const {
		selections,
		updateSelection,
		clearSelections,
		hasSelection,
		mapSelections,
		getSelection,
	} = useSelections<ScoreSegmentID, SegmentSelectionData>();

	// Creates the key that's used to identify each selection
	const createSelectionKey = (
		measureIndex: number,
		xStart: number,
		y: number
	) => {
		// Generate the selection identifier from the parameters
		const positionID: ScoreSegmentID = {
			measureIndex,
			x: xStart,
		};

		// Only if stacked notes are allowed can there be multiple selections within a segment
		if (allowStackedNotes) positionID.y = y;

		return positionID;
	};

	const addSegmentSelection = (
		measureIndex: number,
		measure: Measure,
		xStart: number,
		xEnd: number,
		y: number,
		attributes: MeasureAttributes,
		attributesAtX: Partial<MeasureAttributes>,
		dottedValidator: DottedValidator,
		noteIndex?: number
	) => {
		const selectionKey = createSelectionKey(measureIndex, xStart, y);

		// Create the new selection
		const newSelection: SegmentSelectionData = {
			measureIndex,
			measureNotes: measure.notes,
			xStart,
			xEnd,
			y,
			rollingAttributes: attributes,
			attributesAtX,
			noteIndex,
			dottedValidator,
		};

		// If the selection had a note, include it in the selection details
		const { notes } = measure;
		if (noteIndex !== undefined && noteIndex < notes.length) {
			newSelection.note = notes[noteIndex];
		}

		updateSelection(selectionKey, newSelection);
	};

	const removeSegmentSelection = (
		measureIndex: number,
		x: number,
		y: number
	) => {
		const selectionKey = createSelectionKey(measureIndex, x, y);
		updateSelection(selectionKey);
	};

	return {
		segmentSelections: selections,
		addSegmentSelection,
		removeSegmentSelection,
		clearSegmentSelections: clearSelections,
		hasSegmentSelection: hasSelection,
		getSegmentSelection: getSelection,
	};
};
