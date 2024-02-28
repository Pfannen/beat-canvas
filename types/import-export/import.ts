import { Note } from '@/components/providers/music/types';
import {
	MeasureAttributes,
	MeasureAttributesMXML,
	PartialMeasureAttributes,
	Pitch,
} from '../music';
import { NoteAnnotations } from '../music/note-annotations';

// #region notes

export type NoteImportDetails = {
	// The note's pitch, if the note isn't a rest
	pitch?: Pitch;
	// The note's octave, if the note isn't a rest
	octave?: number;
	// The note's duration as-is from the duration element 
	// Nullable because there's sometimes notes don't have a duration element for some reason
	duration?: number;
	// The note's annotations, if any
	annotations?: NoteAnnotations;
};

// Takes in the current note's details and an element that's a child of the current note element
export type NoteImportHelper = (
	noteDetails: NoteImportDetails,
	el: Element
) => void;

// Names of elements that are a child to a note element: element handler function
export type NoteImportHelperMap = {
	[key in string]: NoteImportHelper;
};


export type NoteImportAnnotationsHelper = (
	a: NoteAnnotations,
	el: Element
) => void;

export type NoteImportAnnotationsHelperMap = {
	[key in string]: NoteImportAnnotationsHelper;
};

// #endregion -----------------------------------------------------

// #region measures -----------------------------------------------

export type MeasureImportDetails = {
	// The current measure's attributes
	currentAttributes: MeasureAttributesMXML;
	// The attributes that are new to the measure - should also update currentAttributes if this is set
	// Will be placed on the measure created from combining these properties
	newAttributes: PartialMeasureAttributes;
	// The measure's notes
	notes: Note[];
	// The current x-position within the measure
	// Note, backup, and forward elements should adjust this property
	curX: number;
};

export type MeasureImportHelper = (
	measureDetails: MeasureImportDetails,
	el: Element
) => void;

export type MeasureImportHelperMap = {
	[key in string]: MeasureImportHelper;
};

export type MeasureAttributesImportHelper = (
	attributes: Partial<MeasureAttributesMXML>,
	el: Element
) => void;

export type MeasureAttributesImportHelperMap = {
	[key in string]: MeasureAttributesImportHelper;
};

// #endregion
