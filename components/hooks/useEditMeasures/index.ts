import { useMusic } from '@/components/providers/music';
import { AssignerExecuter } from '@/types/modify-score/assigner';
import { getPartialMeasureAttributes } from '@/utils/music/measures/measure-attributes';
import { useSelections } from '../useMultipleSelections';
import { ScorePositionID } from '@/types/modify-score';
import { SelectionData } from '@/types/modify-score/assigner/metadata';
import useMeasureRange from '../useMeasureRange';
import { useEffect } from 'react';
import {
	stacklessDottedValidator,
	stacklessNotePlacementValidator,
} from '@/utils/music/note-placement';

export const useEditMeasures = (
	startIndex: number,
	endIndex: number,
	allowStackedNotes = false
) => {
	const {
		measuresItems: { getMeasures, invokeMeasureModifier },
	} = useMusic();
	// Utilize the measure range hook for efficient attribute retrieval
	const {
		getAttributes,
		getRangedMeasures,
		setRangedMeasures,
		getRangedMeasureAtIndex,
	} = useMeasureRange(getMeasures, startIndex, endIndex);
	// Utilize the selections hook for efficient selection look up and modification
	const {
		selections,
		updateSelection: update,
		clearSelections,
		hasSelection,
		mapSelections,
		getSelection,
	} = useSelections<ScorePositionID, SelectionData>();

	// Executes an assigner function with the measures being edited and the current selections
	// NOTE: Once an assigner function is executed, we need to re update all selections if we don't
	// want to clear them after we execute the assigner function
	const executeAssigner: AssignerExecuter = (assigner) => {
		const copy = getRangedMeasures();
		console.log({ selections });
		if (assigner(copy, selections)) {
			setRangedMeasures(copy);
			// Should only clear selections when the assigner is successful?
			clearSelections();
			//refreshSelections();
		}
	};

	// Creates the key that's used to identify each selection
	const createSelectionKey = (
		measureIndex: number,
		xStart: number,
		y: number
	) => {
		// Generate the selection identifier from the parameters
		const positionID: ScorePositionID = {
			measureIndex,
			x: xStart,
		};

		// Only if stacked notes are allowed can there be multiple selections within a segment
		if (allowStackedNotes) positionID.y = y;

		return positionID;
	};

	const createSelection = (
		measureIndex: number,
		xStart: number,
		xEnd: number,
		y: number,
		noteIndex?: number
	) => {
		// Get the measure attributes of the given selection
		const attributes = getAttributes(measureIndex, xStart);
		// Shouldn't ever be null?
		if (attributes === null) return;
		const measure = getRangedMeasureAtIndex(measureIndex);

		// Create the new selection
		const newSelection: SelectionData = {
			measureIndex,
			measureNotes: measure.notes,
			xStart,
			xEnd,
			y,
			rollingAttributes: attributes,
			nonRollingAttributes: getPartialMeasureAttributes(measure, xStart),
			noteIndex,
			dottedValidator: stacklessDottedValidator,
		};

		// If the selection had a note, include it in the selection details
		const { notes } = measure;
		if (noteIndex !== undefined && noteIndex < notes.length) {
			newSelection.note = notes[noteIndex];
		}

		return newSelection;
	};

	// Updates the selections to either contain the given selection (if it doesn't already exist)
	// or remove the given selection (if it already exists)
	const updateSelection = (
		measureIndex: number,
		xStart: number,
		xEnd: number,
		y: number,
		noteIndex?: number
	) => {
		const positionID = createSelectionKey(measureIndex, xStart, y);

		// If the selection already exists, don't bother creating the selection data just to not use it
		if (hasSelection(positionID)) {
			update(positionID);
			return;
		}

		const selection = createSelection(measureIndex, xStart, xEnd, y, noteIndex);

		// Insert the selection along with its key
		// NOTE: This should always insert into the selection array because we already
		// checked if positionID existed
		update(positionID, selection);
	};

	const refreshSelections = () => {
		mapSelections(({ measureIndex }, { xStart, xEnd, noteIndex, y }) => {
			const key = createSelectionKey(measureIndex, xStart, y);
			const selection = createSelection(
				measureIndex,
				xStart,
				xEnd,
				y,
				noteIndex
			);
			if (selection) {
				return { key, value: selection };
			} else return null;
		});
	};

	const commitMeasures = () => {
		const editMeasures = getRangedMeasures();
		invokeMeasureModifier((getMeasures) => {
			const measures = getMeasures();
			const count = endIndex - startIndex + 1;
			for (let i = 0; i < count; i++)
				measures[i + startIndex] = editMeasures[i];
			return true;
		});
	};

	const isSegmentSelected = (measureIndex: number, x: number, y: number) => {
		return hasSelection(createSelectionKey(measureIndex, x, y));
	};

	const isYLevelSelected = (measureIndex: number, x: number, y: number) => {
		const selectionKey = createSelectionKey(measureIndex, x, y);
		const selection = getSelection(selectionKey);
		if (!selection) return false;

		return y === selection.y;
	};

	return {
		editMeasures: getRangedMeasures(),
		selections,
		executeAssigner,
		updateSelection,
		commitMeasures,
		isSegmentSelected,
		isYLevelSelected,
	};
};
