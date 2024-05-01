import {
	Note,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import { getNoteDuration } from '../../components/providers/music/utils'; // Jest doesn't like '@'
import {
	DottedValidator,
	NotePlacementValidator,
	NotePlacer,
} from '@/types/modify-score';
import { rightHandSplits } from '.';
import { findPositionIndex } from '../../components/providers/music/hooks/useMeasures/utils'; // Jest doesn't like '@'
import { indexIsValid } from '..';
import { removeSlur } from './modify-score/note';

// NOTE: This method should really only be used when it's known the x-value is valid
// in terms of not cutting off any prior notes (also, it doesn't look ahead so notes
// in its forward path would be destroyed) OR if it's used as an intermediate placement
// validator
export const isValidXOffsetForNoteType = (
	x: number,
	noteType: NoteType,
	tS: TimeSignature,
	isDotted?: true
) => {
	let noteDuration = getNoteDuration(noteType, tS.beatNote, isDotted);
	// Get the x remainder (the decimal portion of x) for easy lookup
	const xRemainder = x - Math.floor(x);
	// If the remainder is present in the lookup table and the duration it's mapped to
	// is smaller than the note's duration, it cannot be placed at the given x
	if (
		xRemainder in rightHandSplits &&
		noteDuration > rightHandSplits[xRemainder]
	) {
		return false;
	}

	// Factor in if the note is dotted now
	if (isDotted) noteDuration += noteDuration / 2;
	// If the note's duration would extend past the measure, return false
	if (noteDuration + x > tS.beatsPerMeasure) return false;

	return true;
};

export const stacklessNotePlacementValidator: NotePlacementValidator = (
	notes,
	x,
	noteType,
	tS,
	isDotted?: true
) => {
	// Check if the x is a valid offset for the given note type
	// NOTE: This checks if the note would extend past the measure too
	if (!isValidXOffsetForNoteType(x, noteType, tS)) return -1;

	const positionIdx = findPositionIndex(x, notes);
	const noteDur = getNoteDuration(noteType, tS.beatNote, isDotted);

	// Check if note exists at the position index, and check if the current note would overlap it
	// This will be the note that comes after the given note if it gets inserted
	if (positionIdx < notes.length) {
		const noteAtIdx = notes[positionIdx];
		if (x + noteDur > noteAtIdx.x) return -1;
	}

	// Check if note exists 1 before the position index, and if it would overlap with the currnt note
	// This will be the note that comes right before the given note if it gets inserted
	if (positionIdx > 0) {
		const preNote = notes[positionIdx - 1];
		const preNoteDur = getNoteDuration(preNote.type, tS.beatNote, isDotted);
		if (preNoteDur + preNote.x > x) return -1;
	}

	// The note is able to be placed at the given x
	return positionIdx;
};

export const stacklessDottedValidator: DottedValidator = (
	notes,
	noteIndex,
	tS
) => {
	if (!indexIsValid(noteIndex, notes.length)) return false;

	const note = notes[noteIndex];
	if (note.annotations?.dotted) return false;

	const dottedDur = getNoteDuration(note.type, tS.beatNote, true);
	if (indexIsValid(noteIndex + 1, notes.length)) {
		const nextNote = notes[noteIndex + 1];
		if (nextNote.x < note.x + dottedDur) return false;
	}

	return note.x + dottedDur <= tS.beatsPerMeasure;
};

export const placeNote: NotePlacer = (note, notes, validator, tS) => {
	const placementIdx = validator(notes, note.x, note.type, tS);
	if (placementIdx === -1) return false;

	notes.splice(placementIdx, 0, note);

	return true;
};

const attemptRemoveSlur = (notes: Note[], noteIdx: number) => {
	const note = notes[noteIdx];
	if (!note.annotations?.slur) return true;

	const { slur } = note.annotations;
	// If this note starts a slur, go forward and attempt to remove it
	if (slur.start) {
		for (let i = noteIdx; i < notes.length; i++) {
			if (removeSlur(note, notes[i])) break;
		}
	}
	// If this note ends a slur(s), go backwards and attempt to remove it
	if (slur.stop) {
		for (let i = noteIdx; i >= 0; i--) {
			if (removeSlur(note, notes[i])) break;
		}
	}

	// The slur(s) were removed if there is no slur property remaining
	return !note.annotations?.slur;
};

// TODO: Make function work with stacked notes (the reason for adding optional y-value)
export const removeNote = (notes: Note[], x: number, y?: number) => {
	const xIdx = findPositionIndex(x, notes);
	if (xIdx >= notes.length || notes[xIdx].x !== x) return false;

	if (!attemptRemoveSlur(notes, xIdx)) {
		console.log(
			'There was an issue removing the slur(s) on note ' + { note: notes[xIdx] }
		);
		console.log('Were there slurs that were cross-measured?');
	}
	notes.splice(xIdx, 1);
	return true;
};
