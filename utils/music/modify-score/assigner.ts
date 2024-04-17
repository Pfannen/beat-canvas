import {
	AnnotationSelectionMetadata,
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import {
	getMeasureAttributeKeys,
	getNoteAnnotationKeys,
	getNoteTypes,
} from '..';
import { MeasureAttributes } from '@/types/music';
import { NoteType } from '@/components/providers/music/types';
import { NotePlacementValidator } from '@/types/modify-score';

// T: The type the selection metadata originates from
// K: A key in T
// selectionMetadataEntry: The metadata for the K
export const getAssignValue = <T, K extends keyof T>(
	selectionMetadataEntry?: SelectionMetadata<T>[K],
	defaultValue?: T[K]
) => {
	let assignValue: T[K] | undefined;
	if (selectionMetadataEntry) {
		const { value, allSelectionsHave } = selectionMetadataEntry;
		// If all selections don't have the value, selections should be assigned a value
		if (!allSelectionsHave) assignValue = value || defaultValue;
		// Else if all selections do have the value, selections should be assigned a value
		// if 'value' is undefined, or should delete the value if 'value' is not undefined
		else {
			if (!value) assignValue = defaultValue;
			else assignValue = undefined;
		}
	}

	return assignValue;
};

type CountMap<T> = {
	[key in keyof T]?: number;
};

const updateMetadataStructures = <T extends {}>(
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
	if (selections.length === 0) return null;

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

		updateMetadataStructures(metadata, countMap, annotations);
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
	if (selections.length === 0) return null;

	const metadata: SelectionMetadata<Partial<MeasureAttributes>> = {};
	const countMap: CountMap<MeasureAttributes> = {};

	selections.forEach(({ nonRollingAttributes }) => {
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

// NOTE: Can update this method to use binary search, but number of note types are
// small enough where it doesn't matter
export const getValidNotePlacementTypes = (
	selections: SelectionData[],
	placementValidator: NotePlacementValidator
) => {
	if (selections.length === 0) return new Set<NoteType>();

	// Get an array of all note types
	// NOTE: These are sorted in decreasing order of duration
	const noteTypes = getNoteTypes();
	// Store the index of the largest note type we can fit
	let largestValidIdx = 0;

	// Iterate through each selection
	for (let i = 0; i < selections.length; i++) {
		// Extract the variables needed
		const {
			rollingAttributes: { timeSignature },
			xStart,
			measureNotes,
		} = selections[i];

		// Loop while there are still note types left and we can't place the current largest
		// note type at our current x position
		while (
			largestValidIdx < noteTypes.length &&
			placementValidator(
				measureNotes,
				xStart,
				noteTypes[largestValidIdx],
				timeSignature
			) === -1
		) {
			// If we can't place the note at the current x, increment the largest valid index
			largestValidIdx++;
		}
	}

	// If no note type can fit, return null
	if (largestValidIdx >= noteTypes.length) return new Set<NoteType>();
	// Else there exists some note types that can fit all selections, and a set
	// of them is returned for easy lookup
	else return new Set<NoteType>(noteTypes.slice(largestValidIdx));
};
