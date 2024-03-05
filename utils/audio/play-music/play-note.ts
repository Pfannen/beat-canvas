import { getNoteDuration } from '@/components/providers/music/utils';
import { getNoteFromYPos, getSecondsPerBeat } from '@/utils/music';
import { applyKeySignature } from '@/utils/music/key-signature';
import {
	applyNoteAnnotations,
	constructNoteAttributes,
	getFullNote,
} from './apply-note-annotations';
import { updateInstrument } from '../instruments';
import { MeasureAttributes } from '@/types/music';
import { Synth } from 'tone';
import { Note } from '@/components/providers/music/types';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentNotePlayingAttributes } from '@/types/music/note-annotations';

export const playNote = (
	note: Note,
	measureAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentNotePlayingAttributes,
	curX: number,
	now: number
) => {
	const { x, y, type, annotations } = note;
	const { timeSignature, keySignature, clef, metronome } = measureAttributes;

	const secondsPerBeat = getSecondsPerBeat(metronome.beatsPerMinute);
	const noteDuration = getNoteDuration(type, timeSignature.beatNote);
	const pitchOctave = getNoteFromYPos(y, clef);

	applyKeySignature(keySignature, pitchOctave);

	const noteAttributes = constructNoteAttributes(
		pitchOctave,
		noteDuration,
		persistentAttr
	);
	applyNoteAnnotations(noteAttributes, annotations);

	const fullNote = getFullNote(noteAttributes.pitchOctave);
	//console.log(fullNote);

	// Extract the persistent attributes so we can apply them to the note and update
	// them with 'persist'
	const { cur, applyToNote, persist } = noteAttributes.persistentAttributes;

	updateInstrument(instrument, applyToNote.instrumentProps);

	let velocity =
		applyToNote.velocity !== undefined ? applyToNote.velocity : cur.velocity;
	// Clamp velocity between 0 and 1
	velocity = Math.min(1, Math.max(0, velocity));

	instrument.triggerAttackRelease(
		fullNote,
		noteAttributes.duration * secondsPerBeat,
		now + (curX + x) * secondsPerBeat,
		velocity
	);

	// Write back persist to persistentAttr so they are reflected in future playNote calls
	Object.assign(persistentAttr, persist);
	// Update the instrument to have the 'persist' instrument props so they are persisted
	updateInstrument(instrument, persist.instrumentProps);
};
