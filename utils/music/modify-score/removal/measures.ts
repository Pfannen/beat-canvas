import { Measure } from '@/components/providers/music/types';
import { indexRangeIsValid } from '@/utils';
import { noteAttributeGenerator } from '../../measures/traversal';
import { removeDurationAttributes } from './duration-attributes';

export const removeMeasures = (
	measures: Measure[],
	startIdx: number,
	endIdx: number
) => {
	if (!indexRangeIsValid(startIdx, endIdx, measures.length)) return false;

	for (const {
		measureIndex,
		completedDurationAttributes,
	} of noteAttributeGenerator(measures)) {
		if (!completedDurationAttributes) continue;

		// Removes the completed duration attributes if they're in the correct measure ranges
		removeDurationAttributes(
			measures,
			completedDurationAttributes,
			startIdx,
			endIdx,
			measureIndex
		);
	}

	measures.splice(startIdx, endIdx - startIdx + 1);
};
