import { Note } from '@/components/providers/music/types';
import { NoteAnnotations } from '@/types/music/note-annotations';

export const modifyNoteAnnotation = <K extends keyof NoteAnnotations>(
	note: Note,
	annotationName: K,
	value?: NoteAnnotations[K]
) => {
	if (value !== undefined) {
		if (!note.annotations) note.annotations = {};
		note.annotations[annotationName] = value;
	} else {
		if (!note.annotations) return;

		delete note.annotations[annotationName];
		if (Object.keys(note.annotations).length === 0) delete note.annotations;
	}
};
