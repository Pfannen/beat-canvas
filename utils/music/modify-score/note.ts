import { Note } from '@/components/providers/music/types';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { getSlurMatch, notesAreSlurred } from './slur';

const specialAnnotationModifications = new Set<keyof NoteAnnotations>(['slur']);

const cleanUpAnnotationObj = (note: Note) => {
	// If there's no annotations, there's nothing to clean up
	if (!note.annotations) return;
	// If there are no keys in the annotations object, it can be deleted
	if (Object.keys(note.annotations).length === 0) delete note.annotations;
};

export const modifyNoteAnnotation = <K extends keyof NoteAnnotations>(
	note: Note,
	annotationName: K,
	value?: NoteAnnotations[K]
) => {
	if (specialAnnotationModifications.has(annotationName)) {
		console.log(
			`Cannot perform modification for annotation '${annotationName}', it requries special modification`
		);
		return;
	}

	if (value !== undefined) {
		if (!note.annotations) note.annotations = {};
		note.annotations[annotationName] = value;
	} else {
		if (!note.annotations) return;

		delete note.annotations[annotationName];
		cleanUpAnnotationObj(note);
	}
};

export const removeSlur = (note1: Note, note2: Note) => {
	// Make sure slurs exist
	if (!note1.annotations || !note1.annotations.slur) return false;
	if (!note2.annotations || !note2.annotations.slur) return false;

	// Get the matched slur id if it exists
	const slurMatch = getSlurMatch(note1, note2);
	if (!slurMatch) return false;

	// Extract properties
	const { matchedId, note1Start } = slurMatch;
	const { slur: slur1 } = note1.annotations;
	const { slur: slur2 } = note2.annotations;

	// Put the slur that matched its 'start' into 'startSlur'
	let startSlur = note1Start ? slur1 : slur2;
	// Put the slur that matched its 'stop' into 'stopSlur'
	let stopSlur = startSlur === slur1 ? slur2 : slur1;

	// Delete the 'start' property of 'startSlur'
	delete startSlur.start;
	// Filter out the matched id of 'stopSlur'
	stopSlur.stop = stopSlur.stop!.filter((id) => id !== matchedId);
	// If there's no more ids in the stop array, delete it
	if (!stopSlur.stop!.length) delete stopSlur.stop;

	// Check if both notes have any remaining slurs, and if not, remove the annotation
	if (!slur1.start && !slur1.stop) delete note1.annotations.slur;
	if (!slur2.start && !slur2.stop) delete note2.annotations.slur;

	cleanUpAnnotationObj(note1);
	cleanUpAnnotationObj(note2);

	return true;
};

export const addSlur = (
	note1: Note,
	note1MeasureIdx: number,
	note2: Note,
	note2MeasureIdx: number
) => {
	// If the notes are already slurred with one another, return false
	if (notesAreSlurred(note1, note2)) return false;

	// If the notes are on the same x position in the same measure, return false
	if (note1MeasureIdx === note2MeasureIdx && note1.x === note2.x) return false;

	// Create variables for the start and stop note
	let slurStartNote: Note;
	let slurStopNote: Note;
	// If the measure indices are equal, start goes on the lesser x note
	if (note1MeasureIdx === note2MeasureIdx) {
		slurStartNote = note1.x < note2.x ? note1 : note2;
		slurStopNote = slurStartNote === note1 ? note2 : note1;
	}
	// Else if note1's measure idx is smaller, start goes on note1
	else if (note1MeasureIdx < note2MeasureIdx) {
		slurStartNote = note1;
		slurStopNote = note2;
	}
	// Else, note2's measure idx is smaller so start goes on note2
	else {
		slurStartNote = note2;
		slurStopNote = note1;
	}

	// If either note doesn't have annotations, add an object for them
	if (!slurStartNote.annotations) slurStartNote.annotations = {};
	if (!slurStopNote.annotations) slurStopNote.annotations = {};

	// Extract the annotations for easier reference
	const { annotations: startAnn } = slurStartNote;
	const { annotations: stopAnn } = slurStopNote;

	// If start note doesn't have a slur annotation, add an object for it
	if (!startAnn.slur) startAnn.slur = {};
	// If the start note already has a slur, we can't add another slur start to it (as of now) so we clean up and return
	if ('start' in startAnn.slur) {
		// We may need to clean up the annotation objects for both notes as we added them if they didn't exist
		cleanUpAnnotationObj(note1);
		cleanUpAnnotationObj(note2);
		return false;
	}

	// If the stop note doesn't have a slur annotation, add it
	if (!stopAnn.slur) stopAnn.slur = { stop: [] };

	// Generate a guid
	const slurId = Math.random();
	// Add the guid to start and stop slurs
	startAnn.slur.start = slurId;
	stopAnn.slur.stop!.push(slurId);

	return true;
};
