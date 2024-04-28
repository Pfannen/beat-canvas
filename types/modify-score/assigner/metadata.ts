import { Note } from '@/components/providers/music/types';
import { MeasureAttributes } from '@/types/music';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { DottedValidator, NotePlacementValidator } from '..';

// If the 'value' key is present, that means at least 1 selection has that value
// The 'allSelectionsHave' key determines if all the selections have the value 'value'
export type SelectionMetadataEntry<T, K extends keyof T> = {
	value?: T[K];
	allSelectionsHave: boolean;
};

// Maps a key to the metadata for it
export type SelectionMetadata<T> = {
	[key in keyof T]: SelectionMetadataEntry<T, key>;
};

export type AnnotationSelectionMetadata = SelectionMetadata<NoteAnnotations>;

// Example: { accent: { value: 'strong', allSelectionsHave: true } } -> at least 1 selection is able to have
// an accent assigned to it, and all the applicable selections have a 'strong' accent assigned
// Result: The accent assigner button should have the accent annotation removed from all applicable selections

// Example: { accidental: { value: undefined, allSelectionsHave: true } } -> at least 1 selection is able to have
// an accidental assigned to it, and all the applicable selections don't have the accidental annotation assigned
// Result: The accidental assigner button should add the selected accidental value to each applicable selection

// Example: No metadata -> There's no selections that are able to have an annotation assigned
// Result: Do nothing - assigner button should be disabled

export type AttributeSelectionMetadata = SelectionMetadata<MeasureAttributes>;

// NOTE: Work-in-progress
export type SelectionData = {
	measureIndex: number;
	measureNotes: Note[];
	rollingAttributes: MeasureAttributes;
	nonRollingAttributes: Partial<MeasureAttributes>;
	xStart: number;
	xEnd: number;
	y: number;
	dottedValidator: DottedValidator;
	noteIndex?: number;
	note?: Note;
};

// Maps a key to the number of times it's present
export type CountMap<T> = {
	[key in keyof T]?: number;
};

// Function used to update the metadata structures
export type MetadataUpdater<T> = (
	metadata: SelectionMetadata<T>,
	countMap: CountMap<T>,
	selectionData: SelectionData
) => void;

// Function used to update a metadata entry
export type MetadataEntryUpdater<T, K extends keyof T> = (
	metadataEntry: SelectionMetadataEntry<T, K>,
	countMapEntry: CountMap<T>[K],
	validSelectionCount: number
) => boolean;

export type MetadataEntryUpdaterMap<T> = {
	[key in keyof T]: MetadataEntryUpdater<T, key>;
};

export type DefaultAssignerValueMap<T> = {
	[key in keyof T]: T[key];
};

export type AllSelectionsHaveUpdater<T> = (
	metadata: SelectionMetadata<T>,
	countMap: CountMap<T>,
	validSelections: number
) => void;

/* export type MetadataEntryUpdater2<T, K extends keyof T> = (
	item: T[K],
	metadataEntry: SelectionMetadata<T>[K],
	countMapEntry: CountMap<T>[K],
	validSelectionCount: number,
	selectionUtilities: {
		selectionData: SelectionData;
		notePlacementValidator: NotePlacementValidator;
	}
) => SelectionMetadata<T>[K];

export type MetadataEntryUpdaterMap2<T> = {
	[key in keyof T]: MetadataEntryUpdater2<T, key>;
};

export type AnnotationMetadataEntryUpdater<K extends keyof NoteAnnotations> =
	MetadataEntryUpdater2<NoteAnnotations, K>;

export type AttributeMetadataEntryUpdater<K extends keyof MeasureAttributes> =
	MetadataEntryUpdater2<MeasureAttributes, K>; */
