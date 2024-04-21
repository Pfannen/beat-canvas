import { ValidNotePlacements } from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import {
	getMeasureAttributeKeys,
	getNoteAnnotationKeys,
	getNoteTypes,
} from '..';
import { MeasureAttributes } from '@/types/music';
import { NotePlacementValidator } from '@/types/modify-score';
import {
	AnnotationSelectionMetadata,
	CountMap,
	SelectionData,
	SelectionMetadata,
	MetadataEntryUpdater,
	MetadataEntryUpdaterMap,
	SelectionMetadataEntry,
	DefaultAssignerValueMap,
} from '@/types/modify-score/assigner/metadata';

// T: The type the selection metadata originates from
// K: A key in T
// selectionMetadataEntry: The metadata for the K
export const getAssignValue = <T, K extends keyof T>(
	selectionMetadataEntry?: SelectionMetadataEntry<T, K>,
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
	validSelectionCount: number,
	updaterMap?: MetadataEntryUpdaterMap<T>
) => {
	allKeys.forEach((key) => {
		if (key in metadata) {
			const allSelectionsHave = countMap[key] === validSelectionCount;
			metadata[key]!.allSelectionsHave = allSelectionsHave;
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

// #region Annotations

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
		notesSelected,
		specialAnnotationsMetadataUpdaterMap
	);

	return metadata;
};

const slurMetadataUpdater: MetadataEntryUpdater<NoteAnnotations, 'slur'> = (
	metadataEntry,
	countMapEntry,
	validSelectionCount
) => {
	// If there is no metadata entry, we can't do much (it should always be present, though)
	// We must have exactly 2 notes selected to do anything with a slur
	// We also must have 2 notes that have a slur or 2 notes that do not have a slur
	// (the count map entry may be undefined if no slurs were encountered)
	// Return true in these cases to denote the slur annotation is not applicable for the selections
	if (
		!metadataEntry ||
		validSelectionCount !== 2 ||
		(countMapEntry !== undefined && countMapEntry !== 2 && countMapEntry !== 0)
	) {
		return true;
	}

	// If there's two notes that have a slur, the 'value' field of the metadata should be an object
	// If there's two notes that don't have a slur, the 'value' field should be undefined already
	// (These are what we want)

	return false;
};

const specialAnnotationsMetadataUpdaterMap: MetadataEntryUpdaterMap<NoteAnnotations> =
	{
		slur: slurMetadataUpdater,
	};

export const defaultAnnotationValues: DefaultAssignerValueMap<NoteAnnotations> =
	{
		slur: {},
		accent: 'strong',
		accidental: 'flat',
		chord: true,
		staccato: true,
		dotted: true,
		dynamic: 'p',
	};

// #endregion

// #region Attributes

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

// #endregion

// #region Note placement

// NOTE: Can update this method to use binary search, but number of note types are
// small enough where it doesn't matter
export const getValidNotePlacementTypes = (
	selections: SelectionData[],
	placementValidator: NotePlacementValidator
): ValidNotePlacements => {
	if (selections.length === 0) return new Set();

	// Store if at least 1 selection contains a note - used for noting that a note can be removed
	let hasNote = false;
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
			note,
		} = selections[i];

		if (note) hasNote = true;
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

	// If no note type can fit, return an empty set or one with 'r' noting only notes can be removed
	if (largestValidIdx >= noteTypes.length) {
		const set = new Set() as ValidNotePlacements;
		if (hasNote) set.add('r');
		return set;
	}
	// Else there exists some note types that can fit all selections, and a set
	// of them is returned for easy lookup, along with 'r' if notes can also be removed
	else {
		const set = new Set(
			noteTypes.slice(largestValidIdx)
		) as ValidNotePlacements;
		if (hasNote) set.add('r');
		return set;
	}
};

// #endregion
