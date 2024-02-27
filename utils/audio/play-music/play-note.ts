import { getNoteDuration } from '@/components/providers/music/utils';
import { getNoteFromYPos, getSecondsPerBeat } from '@/utils/music';
import { applyKeySignature } from '@/utils/music/key-signature';
import {
	applyNoteAnnotations,
	constructNoteAttributes,
	getFullNote,
} from './apply-note-annotations';
import { ToneInstrument, updateInstrument } from '../instruments';
import { MeasureAttributes } from '@/types/music';
import { Synth } from 'tone';
import { Note } from '@/components/providers/music/types';

export const playNote = (
	note: Note,
	measureAttributes: MeasureAttributes,
	instrument: ToneInstrument,
	curX: number,
	now: number
) => {
	const { x, y, type, annotations } = note;
	const { timeSignature, keySignature, clef, metronome } = measureAttributes;

	const secondsPerBeat = getSecondsPerBeat(metronome.beatsPerMinute);
	const noteDuration = getNoteDuration(type, timeSignature.beatNote);
	const pitchOctave = getNoteFromYPos(y, clef);

	applyKeySignature(keySignature, pitchOctave);

	const noteAttributes = constructNoteAttributes(pitchOctave, noteDuration);
	applyNoteAnnotations(noteAttributes, annotations);

	const fullNote = getFullNote(noteAttributes.pitchOctave);
	console.log(fullNote);

	updateInstrument(instrument, noteAttributes.instrumentProps);

	instrument.triggerAttackRelease(
		fullNote,
		noteAttributes.duration * secondsPerBeat,
		now + (curX + x) * secondsPerBeat,
		noteAttributes.velocity
	);
};
