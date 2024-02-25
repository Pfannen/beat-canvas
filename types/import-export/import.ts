import { Pitch } from '../music';
import { NoteAnnotations } from '../music/note-annotations';

export type NoteImportDetails = {
	pitch?: Pitch;
	octave?: number;
	duration?: number;
	annotations?: NoteAnnotations;
};

export type NoteImportHelper = (
	noteDetails: NoteImportDetails,
	el: Element
) => void;

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
