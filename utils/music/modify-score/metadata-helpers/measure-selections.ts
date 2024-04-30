import {
	CountMap,
	MeasureSelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes, dynamicMeasureAttributesKeys } from '@/types/music';
import { updateAllSelectionsHave, updateMetadataStructures } from '.';
import { getMeasureAttributeKeys } from '../..';

export const getMeasureSelectionsAssignerStructures = (
	selections: MeasureSelectionData[]
) => {
	if (!selections.length) return {};

	const attrMetadata: SelectionMetadata<Partial<MeasureAttributes>> = {};
	const attrCountMap: CountMap<MeasureAttributes> = {};

	selections.forEach((selection) => {
		updateMetadataStructures(
			attrMetadata,
			attrCountMap,
			selection.changedMeasureAttributes
		);
	});

	updateAllSelectionsHave(
		attrMetadata,
		attrCountMap,
		getMeasureAttributeKeys(),
		selections.length
	);

	for (const dynAttr in dynamicMeasureAttributesKeys) {
		if (dynAttr in attrMetadata)
			delete attrMetadata[dynAttr as keyof MeasureAttributes];
	}

	return attrMetadata;
};
