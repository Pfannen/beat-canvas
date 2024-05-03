import {
	AllSelectionsHaveUpdater,
	CountMap,
	DefaultAssignerValueMap,
	MetadataUpdater,
	SegmentSelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';
import { updateAllSelectionsHave, updateMetadataStructures } from '.';
import { getMeasureAttributeKeys } from '../..';

export const getAttributeSelectionMetadata = (selections: SegmentSelectionData[]) => {
	if (selections.length === 0) return null;

	const metadata: SelectionMetadata<Partial<MeasureAttributes>> = {};
	const countMap: CountMap<MeasureAttributes> = {};

	selections.forEach(({ attributesAtX: nonRollingAttributes }) => {
		updateMetadataStructures(metadata, countMap, nonRollingAttributes);
	});

	updateAllSelectionsHave(
		metadata,
		countMap,
		getMeasureAttributeKeys(),
		selections.length
	);

	return metadata as SelectionMetadata<MeasureAttributes>;
};

export const updateAttributeSelectionMetadata: MetadataUpdater<
	Partial<MeasureAttributes>
> = (metadata, countMap, selectionData) => {
	const { attributesAtX: nonRollingAttributes } = selectionData;
	updateMetadataStructures(metadata, countMap, nonRollingAttributes);
};

export const attributeAllSelectionsHaveUpdater: AllSelectionsHaveUpdater<
	Partial<MeasureAttributes>
> = (metadata, countMap, selectionCount) => {
	updateAllSelectionsHave(
		metadata,
		countMap,
		getMeasureAttributeKeys(),
		selectionCount
	);
};

export const defaultAttributeValues: DefaultAssignerValueMap<MeasureAttributes> =
	{
		clef: 'treble',
		dynamic: 'p',
		keySignature: 0,
		metronome: { beatNote: 4, beatsPerMinute: 120 },
		repeat: { forward: true },
		repeatEndings: { endings: [1], type: 'start' },
		timeSignature: { beatNote: 4, beatsPerMeasure: 4 },
		wedge: { crescendo: true, start: true },
	};
