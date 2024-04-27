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
import { InstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';

// method for getting complete note audio attributes
const getCompleteNoteData = (
	note: Note,
	measureAttributes: MeasureAttributes,
	persistentAttr: InstrumentAttributes
) => {
	const { y, type, annotations } = note;
	const { timeSignature, keySignature, clef } = measureAttributes;

	const noteDuration = getNoteDuration(
		type,
		timeSignature.beatNote,
		annotations?.dotted
	);
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

// method for queueing a note onto a transport

export const enqueueNote = (
	note: Note,
	measureAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	persistentAttr: InstrumentAttributes,
	curX: number,
	baseSPB: number,
	transport: Transport
) => {
	transport.schedule((time) => {
		// Update the instrument to have the 'persist' instrument props so they are persisted
		// updateInstrument(instrument, persistentAttr.envelope);

		const noteData = getCompleteNoteData(
			note,
			measureAttributes,
			persistentAttr
		);
		const fullNote = getFullNote(noteData.pitchOctave);

		// Extract the persistent attributes so we can apply them to the note and update
		// them with 'persist'
		const { cur, preNote, postNote } = noteData.persistentAttributes;

		let velocity =
			preNote.velocity !== undefined ? preNote.velocity : cur.velocity;
		// Clamp velocity between 0 and 1
		velocity = Math.min(1, Math.max(0, velocity));

		updateInstrument(instrument, preNote.envelope);

		instrument.triggerAttackRelease(
			fullNote,
			noteData.duration * baseSPB,
			undefined,
			velocity
		);

		// Write back persist to persistentAttr so they are reflected in future playNote calls
		Object.assign(persistentAttr, postNote);
		updateInstrument(instrument, postNote.envelope);
	}, (curX + note.x) * baseSPB);
};
