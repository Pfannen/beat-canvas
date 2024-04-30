import {
	AllSelectionsHaveUpdater,
	AnnotationSelectionMetadata,
	CountMap,
	DefaultAssignerValueMap,
	MetadataEntryUpdater,
	MetadataEntryUpdaterMap,
	MetadataUpdater,
	SegmentSelectionData,
} from '@/types/modify-score/assigner/metadata';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { updateAllSelectionsHave, updateMetadataStructures } from '.';
import { getNoteAnnotationKeys } from '../..';

export const getAnnotationSelectionMetadata = (selections: SegmentSelectionData[]) => {
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

export const updateAnnotationSelectionMetadata: MetadataUpdater<
	NoteAnnotations
> = (metadata, countMap, selectionData) => {
	const { note } = selectionData;
	if (!note) return;

	if (note) {
		const { annotations } = note;
		if (!annotations) return;
		updateMetadataStructures(metadata, countMap, annotations);
	}
};

export const annotationAllSelectionsHaveUpdater: AllSelectionsHaveUpdater<
	NoteAnnotations
> = (metadata, countMap, notesSelected) => {
	updateAllSelectionsHave(
		metadata,
		countMap,
		getNoteAnnotationKeys(),
		notesSelected,
		specialAnnotationsMetadataUpdaterMap
	);
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

export const specialAnnotationsMetadataUpdaterMap: MetadataEntryUpdaterMap<NoteAnnotations> =
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

/* const slurMetadataUpdater: AnnotationMetadataEntryUpdater<'slur'> = (
	slur,
	metadata,
	count,
	noteCount,
	utils
) => {
	// If there is no metadata entry, we can't do much (it should always be present, though)
	// We must have exactly 2 notes selected to do anything with a slur
	// We also must have 2 notes that have a slur or 2 notes that do not have a slur
	// (the count map entry may be undefined if no slurs were encountered)
	// Return true in these cases to denote the slur annotation is not applicable for the selections
	if (
		!metadata ||
		noteCount !== 2 ||
		(count !== undefined && count !== 2 && count !== 0)
	) {
		return metadata;
	}

	// If there's two notes that have a slur, the 'value' field of the metadata should be an object
	// If there's two notes that don't have a slur, the 'value' field should be undefined already
	// (These are what we want)

	return undefined;
};

// NOTE: 'metadata' and 'count' won't be updated based on the current item - that's the job of the updater functions
const dottedMetadataUpdater: AnnotationMetadataEntryUpdater<'dotted'> = (
	dotted,
	metadata,
	count,
	noteCount,
	{ selectionData, notePlacementValidator }
) => {
	// If the note currently doesn't have a dot
	// - Use the validator to see if we can place a dot
	// -- If we can, we want to place a dot, therefore the entry should be { val: undef, allSelHave: false }
	// -- If we can't place the dot, return the current entry - it doesn't matter what happens
	// If the note currently does have a dot
	// - We can always remove a dot, so either return the current entry if it's not undefined, or return a new one

	const { note } = selectionData;

	return undefined;
}; */
