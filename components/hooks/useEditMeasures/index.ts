import { useMusic } from '@/components/providers/music';
import { Measure } from '@/components/providers/music/types';
import { AssignerExecuter, SelectionData } from '@/types/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';
import {
	getMeasureAttributes,
	getPartialMeasureAttributes,
} from '@/utils/music/measures/measure-attributes';
import { noteAttributeGenerator } from '@/utils/music/measures/measure-generator';
import { useEffect, useRef, useState } from 'react';

export const useEditMeasures = (startIndex: number, endIndex: number) => {
	const { getMeasures, invokeMeasureModifier } = useMusic();

	const attributeCache = useRef<MeasureAttributes>();
	const [editMeasures, setEditMeasures] = useState<Measure[]>(
		getMeasures.bind(null, startIndex, endIndex - startIndex + 1)
	);
	const [selections, setSelections] = useState<SelectionData[]>([]);

	// On initial load and when the measures change, reset the attribute cache
	useEffect(() => {
		attributeCache.current = undefined;
	}, [editMeasures]);

	// Recomputes the edit measure's first measure's attributes if the cache is empty,
	// else it does nothing
	const recache = () => {
		if (!attributeCache.current) {
			// Attributes shouldn't be null, be need the if check
			const attributes = getMeasureAttributes(
				getMeasures(0, startIndex + 1),
				startIndex
			);
			attributeCache.current = attributes ? attributes : undefined;
		}
	};

	// Is this function needed?
	function* iterateEditMeasures() {
		recache();

		for (const yieldObj of noteAttributeGenerator(
			editMeasures,
			attributeCache.current
		)) {
			yield yieldObj;
		}
	}

	// Executes an assigner function with the measures being edited and the current selections
	const executeAssigner: AssignerExecuter = (assigner) => {
		const copy = editMeasures.slice();
		if (assigner(copy, selections)) setEditMeasures(copy);
	};

	// Filters the current selections to remove any selections with the same
	// measure index and x
	// NOTE: Should be extended later to also take in a y-position if we want note stacking
	const filterSelections = (measureIndex: number, xStart: number) => {
		return selections.filter(
			({ measureIndex: curMI, xStart: curXStart }) =>
				curMI !== measureIndex || curXStart !== xStart
		);
	};

	// Gets the attributes for the measure at the given index and x position
	const getAttributes = (
		measureIndex: number,
		x = 0
	): MeasureAttributes | null => {
		if (measureIndex >= editMeasures.length || measureIndex < 0) return null;
		// Make sure we have measure attributes for the first edit measure
		recache();

		// Get the attributes of the desired measure and x position
		// Attributes shouldn't be null because the given measure index was checked
		const attributes = getMeasureAttributes(
			editMeasures,
			measureIndex,
			attributeCache.current,
			x
		);
		// Return null (if the attributes were null) or a copy of the attributes
		return attributes && { ...attributes };
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
		// Filter the current selections based on the new selection's measure index and x position
		// NOTE: We need a new copy of the array for react anyways, so it's fine to iterate the selections even if nothing's removed
		const newSelections = filterSelections(measureIndex, xStart);

		// If the new selections length is not the old selections length, then the given selection already
		// existed and was removed
		if (newSelections.length !== selections.length) {
			setSelections(newSelections);
			return;
		}

		// Get the measure attributes of the given selection
		const attributes = getAttributes(measureIndex, xStart);
		// Shouldn't ever be null?
		if (attributes === null) return;
		const measure = editMeasures[measureIndex];

		// Create the new selection
		const newSelection: SelectionData = {
			measureIndex,
			// Deep copy measure notes
			measureNotes: JSON.parse(JSON.stringify(measure.notes)),
			xStart,
			xEnd,
			y,
			rollingAttributes: attributes,
			nonRollingAttributes: getPartialMeasureAttributes(measure, xStart),
			noteIndex,
		};

		// If the selection had a note, include it in the selection details
		const { notes } = measure;
		if (noteIndex !== undefined && notes.length < noteIndex) {
			newSelection.note = notes[noteIndex];
		}

		newSelections.push(newSelection);
		setSelections(newSelections);
	};

	// NOTE: Terrible implementation, will refactor once selection hook is abstracted
	const hasSelection = (measureIndex: number, x: number) => {
		return !!selections.find(
			({ measureIndex: curMI, xStart: curX }) =>
				measureIndex === curMI && curX === x
		);
	};

	const commitMeasures = () => {
		invokeMeasureModifier((getMeasures) => {
			const measures = getMeasures();
			for (let i = 0; i < measures.length; i++)
				measures[i + startIndex] = editMeasures[i];
			return true;
		});
	};

	return {
		editMeasures,
		selections,
		iterateEditMeasures,
		executeAssigner,
		updateSelection,
		commitMeasures,
		hasSelection,
	};
};
