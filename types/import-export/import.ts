import { Note, NoteType } from '@/components/providers/music/types';
import {
	DynamicMeasureAttributes,
	MeasureAttributesMXML,
	Pitch,
	RepeatEndings,
	StaticMeasureAttributes,
	Wedge,
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
	type?: NoteType;
	// The note's annotations, if any
	annotations: NoteAnnotations;
	tbcAnnotations: ToBeCompletedAnnotations;
};

export type ToBeCompletedAnnotations = {
	slurIds?: number[];
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
	details: { a: NoteAnnotations; tbc: ToBeCompletedAnnotations },
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
	// Attributes and annotations that are yet to be completed because they require another value existing that completes them
	tbcValues: ToBeCompletedValues;
	// The attributes that are new to the measure - should also update currentAttributes if this is set
	// Will be placed on the measure created from combining these properties
	//newTemporalAttributes: TemporalMeasureAttributes[];
	newStaticAttributes: Partial<StaticMeasureAttributes>;
	newDynamicAttributes: Partial<DynamicMeasureAttributes>;
	// The measure's notes
	notes: Note[];
	// The current x-position within the measure
	// Note, backup, and forward elements should adjust this property
	curX: number;
	// The current measure's number
	curMeasureNumber: number;
	// The previously parsed note's duration
	// Currently required for notes that are chords so curX can be updated correctly
	prevNoteDur: number;
};

export type ToBeCompletedAttributes = {
	wedge?: Wedge;
	repeatMeasureNumber?: number;
	// Maps an ending to object initially created for it
	// Should update the ending when its end is found by indexing into tbcAttributes
	// and changing the end measure value of the correct ending to the current measure's number
	// and deleting the entry in the tbcAttributes
	repeatEndings?: { [ending in number]: RepeatEndings };
};

export type ToBeCompletedValues = {
	measures: ToBeCompletedAttributes;
	notes: ToBeCompletedAnnotations;
};

export type MeasureImportHelper = (
	measureDetails: MeasureImportDetails,
	el: Element
) => void;

export type MeasureImportHelperMap = {
	[key in string]: MeasureImportHelper;
};

export type HelperAttributesArg = {
	static: Partial<StaticMeasureAttributes>;
	dynamic: Partial<DynamicMeasureAttributes>;
	quarterNoteDivisions?: number;
};

export type MeasureAttributesImportHelper = (
	attributes: HelperAttributesArg,
	el: Element
) => void;

export type MeasureAttributesImportHelperMap = {
	[key in string]: MeasureAttributesImportHelper;
};

// #endregion

// #region MXML types

export type WedgeTypeMXML = 'crescendo' | 'diminuendo' | 'stop' | 'continue';

export type RepeatDirectionMXML = 'forward' | 'backward';

export type NoteTypeMXML =
	| 'whole'
	| 'half'
	| 'quarter'
	| 'eighth'
	| '16th'
	| '32nd'
	| '64th'
	| '128th';

export type AccidentalMXML = 'sharp' | 'flat' | 'natural';

// #endregion
