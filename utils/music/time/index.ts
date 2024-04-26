import { NoteType, TimeSignature } from '@/components/providers/music/types';
import { Metronome } from '@/types/music';
import { getQuarterNoteDuration } from '..';
import { getNoteDuration } from '@/components/providers/music/utils';

export const getSecondsPerQuarterNote = (metronome: Metronome) => {
	// Get the number of quarter notes per beat
	// We use '1' as the duration in the method call to signify the note has a length equal to the beat note of the metronome
	// If the beat note is 8 (for eighth note), the method will return 0.5
	const quarterNotesPerBeat = getQuarterNoteDuration(1, metronome.beatNote);

	// Calcualte the number of beats per second
	// (beats / minute) * (1 minute / 60 seconds) -> beats / second
	const beatsPerSecond = metronome.beatsPerMinute / 60;
	// Calculate the number of seconds per quarter note
	// (beats / second) * (quarter notes / beat) -> quarter notes / second
	const secondsPerQuarterNote = 1 / (beatsPerSecond * quarterNotesPerBeat);

	return secondsPerQuarterNote;
};

export const getQuarterNotesPerMeasure = (timeSignature: TimeSignature) => {
	// Get the number of quarter notes per beat
	// We use '1' as the duration in the method call to signify the note has a length equal to the beat note of the time signature
	// If the beat note is 8 (for eighth note), the method will return 0.5 denoting that half a quarter note
	// can be played in the same time as 1 eighth note
	// This result is multiplied by the number of beats per measure to get the number of quarter notes per measure
	// (quarter notes / beat) * (beats / measure) -> quarter notes / measure
	const quarterNotesPerMeasure =
		getQuarterNoteDuration(1, timeSignature.beatNote) *
		timeSignature.beatsPerMeasure;

	return quarterNotesPerMeasure;
};

export const getSecondsBetweenXs = (
	x1: number,
	x2: number,
	metronome: Metronome,
	timeSignature: TimeSignature
) => {
	// Get the number of seconds per quarter note
	const secondsPerQuarterNote = getSecondsPerQuarterNote(metronome);
	// Get the number of quarter notes that can be played in the given duration
	// If x1 = 0 and x2 = 0.5 with the time signature beat-note being 4 (for quarter note), the
	// number of quarter notes that can be played in that duration is 0.5
	// Given the same xs but the beat-note was 8 (for eighth note), this time span would represent a sixteenth note
	// and 4 quarter notes can be played in that duration
	const quarterNotesPerDuration = getQuarterNoteDuration(
		x2 - x1,
		timeSignature.beatNote
	);

	// (seconds / quarter note) * (quarter notes / duration) -> seconds / duration
	return secondsPerQuarterNote * quarterNotesPerDuration;
};

export const getSecondsDurationOfNoteType = (
	noteType: NoteType,
	metronome: Metronome,
	timeSignature: TimeSignature,
	isDotted?: true
) => {
	const noteXDuration = getNoteDuration(
		noteType,
		timeSignature.beatNote,
		isDotted
	);

	return getSecondsBetweenXs(0, noteXDuration, metronome, timeSignature);
};
