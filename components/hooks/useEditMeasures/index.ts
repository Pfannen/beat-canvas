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
	const [editMeasures, setEditMeasures] = useState<Measure[]>([]);
	const [selections, setSelections] = useState<SelectionData[]>([]);

	// On initial load and when the measures change, reset the attribute cache
	useEffect(() => {
		attributeCache.current = undefined;
	}, [editMeasures]);

	useEffect(
		() => setEditMeasures(getMeasures(startIndex, endIndex - startIndex + 1)),
		[setEditMeasures, getMeasures, startIndex, endIndex]
	);

	const recache = () => {
		if (!attributeCache.current) {
			attributeCache.current = getMeasureAttributes(
				getMeasures(0, startIndex + 1)
			);
		}
	};

	function* iterateEditMeasures() {
		recache();

		for (const yieldObj of noteAttributeGenerator(
			editMeasures,
			attributeCache.current
		)) {
			yield yieldObj;
		}
	}

	const executeAssigner: AssignerExecuter = (assigner) => {
		const copy = editMeasures.slice();
		if (assigner(copy, selections)) setEditMeasures(copy);
	};

	const filterSelections = (measureIndex: number, xStart: number) => {
		return selections.filter(
			({ measureIndex: curMI, xStart: curXStart }) =>
				curMI !== measureIndex && curXStart !== xStart
		);
	};

	const getAttributes = (offset: number, x = 0): MeasureAttributes | null => {
		if (offset > endIndex - startIndex || offset < 0) return null;
		recache();

		const attributes = getMeasureAttributes(
			editMeasures,
			attributeCache.current,
			x
		);
		return { ...attributes };
	};

	const addSelection = (
		measureIndex: number,
		xStart: number,
		xEnd: number,
		y: number,
		noteIndex?: number
	) => {
		const newSelections = filterSelections(measureIndex, xStart);

		// Can be null if bad measure index is given
		const attributes = getAttributes(measureIndex, xStart);
		if (attributes === null) return;
		const measure = editMeasures[measureIndex];

		const newSelection: SelectionData = {
			measureIndex,
			xStart,
			xEnd,
			y,
			rollingAttributes: attributes,
			nonRollingAttributes: getPartialMeasureAttributes(measure, xStart),
			noteIndex,
		};

		const { notes } = measure;
		if (noteIndex !== undefined && notes.length < noteIndex) {
			newSelection.note = notes[noteIndex];
		}

		newSelections.push(newSelection);
		setSelections(newSelections);
	};

	const removeSelection = (measureIndex: number, xStart: number) => {
		setSelections(filterSelections(measureIndex, xStart));
	};

	const commitMeasures = () => {
		invokeMeasureModifier((getMeasures) => {
			const measures = getMeasures(startIndex, endIndex - startIndex + 1);
			for (let i = 0; i < measures.length; i++) measures[i] = editMeasures[i];
			return true;
		});
	};

	return {
		editMeasures,
		selections,
		iterateEditMeasures,
		executeAssigner,
		addSelection,
		removeSelection,
		commitMeasures,
	};
};
