import { ScoreMeasureID } from '@/types/modify-score';
import { useSelections } from '.';
import { MeasureSelectionData } from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';

export const useMeasureSelections = () => {
	const {
		selections,
		updateSelection,
		clearSelections,
		hasSelection,
		getSelection,
	} = useSelections<ScoreMeasureID, MeasureSelectionData>();

	// Creates the key that's used to identify each selection
	const createSelectionKey = (measureIndex: number) => {
		// Generate the selection identifier from the parameters
		const measureId: ScoreMeasureID = measureIndex;

		return measureId;
	};

	const addMeasureSelection = (
		measureIndex: number,
		changedMeasureAttributes: Partial<MeasureAttributes>
	) => {
		const selectionKey = createSelectionKey(measureIndex);

		// Create the new selection
		const newSelection: MeasureSelectionData = {
			measureIndex,
			changedMeasureAttributes,
		};

		updateSelection(selectionKey, newSelection);
	};

	const removeMeasureSelection = (measureIndex: number) => {
		const selectionKey = createSelectionKey(measureIndex);
		updateSelection(selectionKey);
	};

	return {
		measureSelections: selections,
		addMeasureSelection,
		removeMeasureSelection,
		clearMeasureSelections: clearSelections,
		hasMeasureSelection: hasSelection,
		getMeasureSelection: getSelection,
	};
};
