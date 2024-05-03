import {
	DurationAttributeRemover,
	DurationAttributeRemoverMap,
} from '@/types/music/removal';
import { indexIsValid, indexRangeIsValid } from '@/utils';
import { removeSlur } from '../note';
import { modifyMeasureAttribute } from '../measures';
import { DurationAttributeInfo } from '@/types/music/measure-traversal';
import { Measure } from '@/components/providers/music/types';

const removeSlurDurationAttribute: DurationAttributeRemover = (
	measures,
	durLocInfo
) => {
	const { measureStartIdx, measureEndIdx, durItemStartIdx, durItemEndIdx } =
		durLocInfo;

	if (!indexRangeIsValid(measureStartIdx, measureEndIdx, measures.length))
		return;

	const startNotes = measures[measureStartIdx].notes;
	const endNotes = measures[measureEndIdx].notes;
	if (
		!indexIsValid(durItemStartIdx, startNotes.length) ||
		!indexIsValid(durItemEndIdx, endNotes.length)
	)
		return;

	const startNote = startNotes[durItemStartIdx];
	const endNote = endNotes[durItemEndIdx];

	removeSlur(startNote, endNote);
};

const removeWedgeDurationAttribute: DurationAttributeRemover = (
	measures,
	durLocInfo
) => {
	const { measureStartIdx, measureEndIdx, durItemStartIdx, durItemEndIdx } =
		durLocInfo;

	if (!indexRangeIsValid(measureStartIdx, measureEndIdx, measures.length))
		return;

	const startAttrs = measures[measureStartIdx].temporalAttributes;
	const endAttrs = measures[measureEndIdx].temporalAttributes;
	if (!startAttrs || !endAttrs) return;

	modifyMeasureAttribute(durItemStartIdx, measures, measureStartIdx, 'wedge');
	modifyMeasureAttribute(durItemEndIdx, measures, measureEndIdx, 'wedge');
};

const shouldRemoveDurationAttribute = (
	removeStartIdx: number,
	removeEndIdx: number,
	currentIdx: number,
	durStartIdx: number
) => {
	const durIdxBetween =
		durStartIdx >= removeStartIdx && durStartIdx <= removeEndIdx;
	const curIdxBetween =
		removeStartIdx <= currentIdx && currentIdx <= removeEndIdx;
	// If the duration attribute starts in between the removal measures, or we're currently between the removal measures,
	// the duration attribute should be removed
	if (durIdxBetween || curIdxBetween) return true;

	const durIdxBeforeStartIdx = durStartIdx < removeStartIdx;
	const curIdxPastStartIdx = currentIdx >= removeStartIdx;

	// If the duration attribute starts before the removal measures and the current measure is beyond the start removal measure,
	// the duration attribute should be removed
	if (durIdxBeforeStartIdx && curIdxPastStartIdx) return true;

	return false;
};

// NOTE: Best to make noteAttributeGenerator also store indices instead of just xStart and xEnd properties
// NOTE: Bad OCP, issue is with slur being an array
export const removeDurationAttributes = (
	measures: Measure[],
	info: DurationAttributeInfo,
	removeStartIdx: number,
	removeEndIdx: number,
	curIdx: number
) => {
	const { slur, wedge } = info;

	if (slur) {
		slur.forEach(({ measureStartIndex, measureEndIndex, xStart, xEnd }) => {
			if (
				!shouldRemoveDurationAttribute(
					removeStartIdx,
					removeEndIdx,
					curIdx,
					measureEndIndex
				)
			)
				return;
			const startIdx = measures[measureStartIndex].notes.findIndex(
				(note) => note.x === xStart
			);
			const endIdx = measures[measureEndIndex].notes.findIndex(
				(note) => note.x === xEnd
			);

			removeSlurDurationAttribute(measures, {
				measureStartIdx: measureStartIndex,
				measureEndIdx: measureEndIndex,
				durItemStartIdx: startIdx,
				durItemEndIdx: endIdx,
			});
		});
	}

	if (wedge) {
		const { measureStartIndex, measureEndIndex, xStart, xEnd } = wedge;
		if (
			!shouldRemoveDurationAttribute(
				removeStartIdx,
				removeEndIdx,
				curIdx,
				measureEndIndex
			)
		)
			return;
		const startIdx = measures[measureStartIndex].temporalAttributes?.findIndex(
			({ x }) => x === xStart
		);
		const endIdx = measures[measureEndIndex].temporalAttributes?.findIndex(
			({ x }) => x === xEnd
		);
		if (startIdx === undefined || endIdx === undefined) return;
		removeWedgeDurationAttribute(measures, {
			measureStartIdx: measureStartIndex,
			measureEndIdx: measureEndIndex,
			durItemStartIdx: startIdx,
			durItemEndIdx: endIdx,
		});
	}
};

export const durationAttributeRemoverMap: DurationAttributeRemoverMap = {
	slur: removeSlurDurationAttribute,
	wedge: removeWedgeDurationAttribute,
};
