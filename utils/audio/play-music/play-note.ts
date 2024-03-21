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
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';

// method for getting complete note audio attributes
const getCompleteNoteData = (
	note: Note,
	measureAttributes: MeasureAttributes,
	persistentAttr: PersistentInstrumentAttributes
) => {
	const { y, type, annotations } = note;
	const { timeSignature, keySignature, clef } = measureAttributes;

	const noteDuration = getNoteDuration(type, timeSignature.beatNote);
	const pitchOctave = getNoteFromYPos(y, clef);

	applyKeySignature(keySignature, pitchOctave);

	const noteAttributes = constructNoteAttributes(
		pitchOctave,
		noteDuration,
		persistentAttr
	);
	applyNoteAnnotations(noteAttributes, annotations);

	return noteAttributes;
};

export const playNote = (
	note: Note,
	measureAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentInstrumentAttributes,
	curX: number,
	now: number
) => {
	const { x } = note;
	const { metronome } = measureAttributes;
	const secondsPerBeat = getSecondsPerBeat(metronome.beatsPerMinute);
	const noteData = getCompleteNoteData(note, measureAttributes, persistentAttr);
	const fullNote = getFullNote(noteData.pitchOctave);
	//console.log(fullNote);

	// Extract the persistent attributes so we can apply them to the note and update
	// them with 'persist'
	const { cur, applyToNote, persist } = noteData.persistentAttributes;

	updateInstrument(instrument, applyToNote.instrumentProps);

	let velocity =
		applyToNote.velocity !== undefined ? applyToNote.velocity : cur.velocity;
	// Clamp velocity between 0 and 1
	velocity = Math.min(1, Math.max(0, velocity));

	instrument.triggerAttackRelease(
		fullNote,
		noteData.duration * secondsPerBeat,
		now + (curX + x) * secondsPerBeat,
		velocity
	);

	// Write back persist to persistentAttr so they are reflected in future playNote calls
	Object.assign(persistentAttr, persist);
	// Update the instrument to have the 'persist' instrument props so they are persisted
	updateInstrument(instrument, persist.instrumentProps);
};

// method for queueing a note onto a transport

export const enqueueNote = (
	note: Note,
	measureAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: PersistentInstrumentAttributes,
	curX: number,
	baseSPB: number,
	transport: Transport
) => {
	transport.schedule((time) => {
		// Update the instrument to have the 'persist' instrument props so they are persisted
		updateInstrument(instrument, persistentAttr.instrumentProps);

		const noteData = getCompleteNoteData(
			note,
			measureAttributes,
			persistentAttr
		);
		const fullNote = getFullNote(noteData.pitchOctave);

		// Extract the persistent attributes so we can apply them to the note and update
		// them with 'persist'
		const { cur, applyToNote, persist } = noteData.persistentAttributes;

		let velocity =
			applyToNote.velocity !== undefined ? applyToNote.velocity : cur.velocity;
		// Clamp velocity between 0 and 1
		velocity = Math.min(1, Math.max(0, velocity));

		updateInstrument(instrument, applyToNote.instrumentProps);

		instrument.triggerAttackRelease(
			fullNote,
			noteData.duration * baseSPB,
			undefined,
			velocity
		);

		// Write back persist to persistentAttr so they are reflected in future playNote calls
		Object.assign(persistentAttr, persist);
	}, (curX + note.x) * baseSPB);
};
