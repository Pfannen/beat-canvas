import {
	AnnotationSelectionMetadata,
	AttributeSelectionMetadata,
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { getMeasureAttributeKeys, getNoteAnnotationKeys } from '..';
import { MeasureAttributes } from '@/types/music';

// T: The type the selection metadata originates from
// K: A key in T
// selectionMetadataEntry: The metadata for the K
export const getAssignValue = <T, K extends keyof T>(
	selectionMetadataEntry?: SelectionMetadata<T>[K]
) => {
	let assignValue: T[K] | undefined;
	if (selectionMetadataEntry) {
		const { value, allSelectionsHave } = selectionMetadataEntry;
		// If all selections don't have the value, assign them strong
		// OR if all selections do have the value, which is undefined, assign them strong
		if (!allSelectionsHave || !value) assignValue = value;
		// Else assignValue remains undefined
	}

	return assignValue;
};

type CountMap<T> = {
	[key in keyof T]?: number;
};

const updateStructures = <T extends {}>(
	metadata: SelectionMetadata<T>,
	countMap: CountMap<T>,
	instance: T
) => {
	// Iterate this way for easy typing
	const keys = Object.keys(instance) as (keyof T)[];
	for (const key of keys) {
		// Extract the anno count if it exists, else set equal to 0
		const annoCount = countMap[key] || 0;
		// Increment the anno count
		countMap[key] = annoCount + 1;

		// If this is the first occurrence of the key
		if (!metadata[key]) {
			// Grab its value
			const value = instance[key];
			// Store it in the metadata ('value' typing requires 'as any', but I'm sure the types are correct)
			metadata[key] = {
				value: value as any,
				// This field will be updated later
				allSelectionsHave: false,
			};
		}
	}
};

const updateAllSelectionsHave = <T extends {}>(
	metadata: SelectionMetadata<T>,
	countMap: CountMap<T>,
	allKeys: (keyof T)[],
	validSelectionCount: number
) => {
	allKeys.forEach((key) => {
		if (key in metadata) {
			const allSelectionsHave = countMap[key] === validSelectionCount;
			metadata[key]!.allSelectionsHave = allSelectionsHave;
		} else {
			metadata[key] = { allSelectionsHave: true };
		}
	});
};

export const getAnnotationSelectionMetadata = (selections: SelectionData[]) => {
	// Store selection metadata
	const metadata: AnnotationSelectionMetadata = {};
	// Store a mapping of annotation -> count ; used to determine if all selections have an annotation
	const countMap: CountMap<NoteAnnotations> = {};

	// Keep track of which selections are notes
	let notesSelected = 0;
	selections.forEach(({ note }) => {
		if (!note) return;
		notesSelected++;

		const { annotations } = note;
		if (!annotations) return;

		updateStructures(metadata, countMap, annotations);
	});

	if (notesSelected === 0) return null;

	updateAllSelectionsHave(
		metadata,
		countMap,
		getNoteAnnotationKeys(),
		notesSelected
	);

	// All annotations will have metadata associated with them
	return metadata as SelectionMetadata<Required<NoteAnnotations>>;
};

export const getAttributeSelectionMetadata = (selections: SelectionData[]) => {
	const metadata: SelectionMetadata<Partial<MeasureAttributes>> = {};
	const countMap: CountMap<MeasureAttributes> = {};

	selections.forEach(({ nonRollingAttributes }) => {
		updateStructures(metadata, countMap, nonRollingAttributes);
	});

	updateAllSelectionsHave(
		metadata,
		countMap,
		getMeasureAttributeKeys(),
		selections.length
	);

	return metadata as SelectionMetadata<MeasureAttributes>;
};
