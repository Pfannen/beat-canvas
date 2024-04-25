import { Note, TimeSignature } from '@/components/providers/music/types';
import { getNoteDuration } from '@/components/providers/music/utils';
import {
	AnnotationPEC,
	ElementCreator,
	PropertyElementCreatorMap,
} from '@/types/import-export/export-mxml';
import { Clef } from '@/types/music';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { getNoteFromYPos } from '@/utils/music';

const pitchEC = (note: Note, clef: Clef) => {
	const pitchEl = document.createElement('pitch');
	const stepEl = document.createElement('step');
	const octaveEl = document.createElement('octave');

	const { pitch, octave } = getNoteFromYPos(note.y, clef);
	stepEl.textContent = pitch;
	octaveEl.textContent = octave.toString();

	return pitchEl;
};

export const noteEC = (note: Note, beatNote: number, clef: Clef) => {
	const noteEl = document.createElement('note');

	const pitchEl = pitchEC(note, clef);

	const durationEl = document.createElement('duration');
	durationEl.textContent = getNoteDuration(note.type, beatNote).toString();

	const typeEl = document.createElement('type');
	typeEl.textContent = note.type;

	noteEl.appendChild(pitchEl);
	noteEl.appendChild(durationEl);
	noteEl.appendChild(typeEl);

	if (note.annotations) {
		const { annotations } = note;
		for (const key in annotations) {
			const key2 = key as keyof NoteAnnotations;
			const annotation = annotations[key2];
			const annotationElementCreator = noteAnnotationsPECMap[key2];
			const elements = annotationElementCreator(annotation);
			elements.forEach((el) => noteEl.appendChild(el));
		}
	}

	return [noteEl];
};

const dottedPEC: AnnotationPEC<'dotted'> = (dotted) => {
	if (dotted) return [document.createElement('dot')];
	else return [];
};

export const noteAnnotationsPECMap: PropertyElementCreatorMap<NoteAnnotations> =
	{
		dotted: dottedPEC,
	};
