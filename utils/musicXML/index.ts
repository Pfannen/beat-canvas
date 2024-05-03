import { NoteType } from '@/components/providers/music/types';
import { Clef, Pitch } from '@/types/music';

export const clefToMusicXML = (clef: Clef) => {
	if (clef === 'alto') return 'F1';
	else if (clef === 'bass') return 'G1';
	else return 'E1';
};

export const musicXMLToClef = (pitch: Pitch, lineNumber: number): Clef => {
	const pitchDrops = ((lineNumber - 1) * 2) % 7;
	let pitchCharCode = pitch.charCodeAt(0) - pitchDrops;
	if (pitchCharCode < 'A'.charCodeAt(0))
		pitchCharCode = pitch.charCodeAt(0) + (7 - pitchDrops);
	const newPitch = String.fromCharCode(pitchCharCode);

	if (newPitch === 'F') return 'alto';
	else if (newPitch === 'G') return 'bass';
	else return 'treble';
};

// In MusicXML, the computed duration is with respect to a quarter note and disregards the time signature
// An eighth note will always have a computed duration of 0.5 in MusicXML
// In our app, a duration of 1 means the note is of type whatever note gets the beat
// For instance, in 3/8 time an eighth note has a duration of 1 because the eighth note gets the beat
export const convertImportedDuration = (
	quarterNoteDivisions: number,
	durationXMLTextContent: number,
	beatNote: number
) => {
	// The duration the note takes up with respect to a quarter note (i.e. eighth note would be 0.5);
	const quarterDuration = durationXMLTextContent / quarterNoteDivisions;

	// The type of the note in number format
	// If quarterDuration was 0.5, then numberNoteType would be 8 because 4 / 0.5 which means the note is an eighth note
	const numberNoteType = 4 / quarterDuration;

	// The true duration of the note with respect to what gets the beat
	const trueDuration = beatNote / numberNoteType;

	return trueDuration;
};

export const convertJSNoteTypeToMusicXML = (noteType: NoteType): string => {
	if (noteType.startsWith('dotted-')) noteType = noteType.slice(7) as NoteType;
	if (noteType === 'sixteenth') return '16th';
	else if (noteType === 'thirtysecond') return '32nd';
	else return noteType;
};
