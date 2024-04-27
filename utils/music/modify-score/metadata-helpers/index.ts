import { NoteAnnotations } from '@/types/music/note-annotations';
import { MeasureAttributes } from '@/types/music';
import {
	AnnotationSelectionMetadata,
	CountMap,
	SelectionData,
	SelectionMetadata,
	MetadataEntryUpdaterMap,
	SelectionMetadataEntry,
} from '@/types/modify-score/assigner/metadata';
import {
	annotationAllSelectionsHaveUpdater,
	updateAnnotationSelectionMetadata,
} from './annotations';
import {
	attributeAllSelectionsHaveUpdater,
	updateAttributeSelectionMetadata,
} from './attributes';
import {
	getLargestValidNoteType,
	getValidNotePlacementSet,
} from './note-placement';
import { NotePlacementValidator } from '@/types/modify-score';
import { NoteType } from '@/components/providers/music/types';

// T: The type the selection metadata originates from
// K: A key in T
// currentValue: The current value that is attempting to be assigned
// metadataEntry: The metadata for the K
export const getAssignValue = <T, K extends keyof T>(
	currentValue: T[K],
	metadataEntry?: SelectionMetadataEntry<T, K>
) => {
	let assignValue: T[K] | undefined;
	// If there's no entry, it doesn't matter what assignValue is (the querying thing shouldn't be able to be assigned)
	if (metadataEntry) {
		const { value, allSelectionsHave } = metadataEntry;
		// If all selections don't have the value, selections should be assigned currentValue
		if (!allSelectionsHave) assignValue = currentValue;
		// Else if all selections do have the value, selections should be assigned a value
		// If all selections have the value in the metadata AND the value is not undefined, we need to check
		// if currentValue is equal to the value in the metadata - if it is, undefined
		// (i.e. the querying thing should be removed) should be assigned, else the current value should be assigned
		else {
			const currentValueIsAllSelected =
				JSON.stringify(currentValue) === JSON.stringify(value);
			if (currentValueIsAllSelected) assignValue = undefined;
			else assignValue = currentValue;
		}
	}

	return assignValue;
};

export const assignerShouldDisable = (
	metadataEntry?: SelectionMetadataEntry<any, any>
) => !metadataEntry;

export const assignerShouldAddValue = (value: any) => value !== undefined;

export const updateMetadataStructures = <T extends {}>(
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

export const updateAllSelectionsHave = <T extends {}>(
	metadata: SelectionMetadata<T>,
	countMap: CountMap<T>,
	allKeys: (keyof T)[],
	validSelectionCount: number,
	updaterMap?: MetadataEntryUpdaterMap<T>
) => {
	allKeys.forEach((key) => {
		if (key in metadata) {
			const allSelectionsHave = countMap[key] === validSelectionCount;
			metadata[key].allSelectionsHave = allSelectionsHave;
		} else {
			metadata[key] = { allSelectionsHave: true };
		}

		if (updaterMap && key in updaterMap) {
			if (updaterMap[key](metadata[key], countMap[key], validSelectionCount)) {
				delete metadata[key];
			}
		}
	});
};

export const getAssignerStructures = (
	selections: SelectionData[],
	notePlacementValidator: NotePlacementValidator
) => {
	if (!selections.length)
		return {
			annotationMetadata: null,
			attributeMetadata: null,
			validPlacementTypes: new Set<NoteType>(),
		};

	// Store selection metadata
	const annoMetadata: AnnotationSelectionMetadata = {};
	// Store a mapping of annotation -> count ; used to determine if all selections have an annotation
	const annoCountMap: CountMap<NoteAnnotations> = {};
	const attrMetadata: SelectionMetadata<Partial<MeasureAttributes>> = {};
	const attrCountMap: CountMap<MeasureAttributes> = {};

	let notesSelected = 0;
	let noteTypeIdx = 0;
	selections.forEach((selection) => {
		const { note } = selection;
		if (note) {
			notesSelected++;
			updateAnnotationSelectionMetadata(annoMetadata, annoCountMap, selection);
		}

		updateAttributeSelectionMetadata(attrMetadata, attrCountMap, selection);
		noteTypeIdx = getLargestValidNoteType(
			noteTypeIdx,
			notePlacementValidator,
			selection
		);
	});

	annotationAllSelectionsHaveUpdater(annoMetadata, annoCountMap, notesSelected);
	attributeAllSelectionsHaveUpdater(
		attrMetadata,
		attrCountMap,
		selections.length
	);
	const notePlacementSet = getValidNotePlacementSet(
		noteTypeIdx,
		!!notesSelected
	);

	return {
		annotationMetadata: notesSelected > 0 ? annoMetadata : null,
		attributeMetadata: attrMetadata,
		validPlacementTypes: notePlacementSet,
	};
};
