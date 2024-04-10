import { Measure, NoteType } from '@/components/providers/music/types';
import { Clef, PitchOctave } from '@/types/music';
import { NoteAnnotations } from '@/types/music/note-annotations';

export const getSecondsPerBeat = (bpm: number) => 1 / (bpm / 60);

export const getMeasureXStart = (xPos: number, beatsPerMeasure: number) =>
	Math.floor(xPos / beatsPerMeasure);

const clefBasePitchOctave: { [key in Clef]: PitchOctave } = {
	alto: {
		pitch: 'F',
		octave: 3,
	},
	bass: {
		pitch: 'G',
		octave: 2,
	},
	treble: {
		pitch: 'E',
		octave: 4,
	},
	baritone: {
		pitch: 'B',
		octave: 2,
	},
	tenor: {
		pitch: 'D',
		octave: 3,
	},
	soprano: {
		pitch: 'C',
		octave: 4,
	},
};

const cCharCode = 'C'.charCodeAt(0);
const aCharCode = 'A'.charCodeAt(0);
const gCharCode = 'G'.charCodeAt(0);

const increaseOctave = (targetPitchCC: number, basePitchCC: number) => {
	// Case 1: The base pitch is above a C AND target pitch is between a C and the base pitch
	// This occurs when the target pitch wraps around a G and ends up between a C and the base pitch
	// There's a more concise way to write this with only 2 ANDs, but this way is clearer
	if (
		basePitchCC > cCharCode &&
		targetPitchCC >= cCharCode &&
		targetPitchCC < basePitchCC
	)
		return true;
	// Case 2: The base pitch is below a C AND either the target pitch is above or equal to a C OR the target pitch is less than the base pitch
	// This occurs when the target pitch is a C or above OR wraps from a G to a pitch less than the base pitch
	if (
		basePitchCC < cCharCode &&
		(targetPitchCC >= cCharCode || targetPitchCC < basePitchCC)
	)
		return true;
};

const decreaseOctave = (targetPitchCC: number, basePitchCC: number) => {
	// Case 1: The base pitch is below a C AND target pitch is between a C and the base pitch
	// This occurs when the target pitch wraps around an A and ends up between a C and the base pitch
	// There's a more concise way to write this with only 2 ANDs, but this way is clearer
	if (
		basePitchCC < cCharCode &&
		targetPitchCC < cCharCode &&
		targetPitchCC > basePitchCC
	)
		return true;
	// Case 2: The base pitch is a C or above AND the target pitch is below a C OR the target pitch is above the base pitch
	// This occurs when the target pitch is below a C OR wraps around an A to a pitch greater than the the base pitch
	if (
		basePitchCC >= cCharCode &&
		(targetPitchCC < cCharCode || targetPitchCC > basePitchCC)
	)
		return true;
};

export const getNoteFromYPos = (yPos: number, clef: Clef) => {
	const { pitch: basePitch, octave: baseOctave } = clefBasePitchOctave[clef];
	const basePitchCC = basePitch.charCodeAt(0);

	// If yPos is -1, floor(-1/7) is -1 and we don't want that
	const octaveSteps = Math.floor(Math.abs(yPos) / 7) * Math.sign(yPos);
	const pitchSteps = yPos % 7;

	let targetOctave = baseOctave + octaveSteps;
	let targetPitchCC = basePitchCC + pitchSteps;

	// Could've gone too far right with pitch
	if (yPos > 0) {
		if (targetPitchCC > gCharCode) {
			const overflow = targetPitchCC - gCharCode;
			// If we overflowed 1, that means we want an A
			targetPitchCC = aCharCode + (overflow - 1);
		}
		if (increaseOctave(targetPitchCC, basePitchCC)) targetOctave += 1;
	}
	// Could've gone too far left with pitch
	else if (yPos < 0) {
		if (targetPitchCC < aCharCode) {
			const overflow = aCharCode - targetPitchCC;
			// If we overflowed 1, that means we want a G
			targetPitchCC = gCharCode - (overflow - 1);
		}
		if (decreaseOctave(targetPitchCC, basePitchCC)) targetOctave -= 1;
	}
	return {
		pitch: String.fromCharCode(targetPitchCC),
		octave: targetOctave,
	} as PitchOctave;
};

export const getYPosFromNote = (note: PitchOctave, clef: Clef) => {
	const { pitch: basePitch, octave: baseOctave } = clefBasePitchOctave[clef];

	const { pitch: targetPitch, octave: targetOctave } = note;

	// Get into the right octave
	const octaveSteps = targetOctave - baseOctave;
	// Convert base pitch to a C in targetOctave -> now we know that targetPitch MUST be a positive distance from us
	let stepsToC = 'C'.charCodeAt(0) - basePitch.charCodeAt(0);
	// If stepsToC is positive, we'll end up in the next octave's C, so we need to subtract 7
	if (stepsToC > 0) stepsToC -= 7;
	// Calculate the number of steps to reach the target pitch from
	let stepsToTargetPitch = targetPitch.charCodeAt(0) - 'C'.charCodeAt(0);
	// If the steps are negative, we'll end up going to the previous octave's pitchTarget, so we need to add 7
	if (stepsToTargetPitch < 0) stepsToTargetPitch += 7;

	// Add all the results, factoring in stepsToC
	const yPos = octaveSteps * 7 + stepsToC + stepsToTargetPitch;

	return yPos;
};

const quarterDurationToNoteType: { [key in number]: NoteType } = {
	4: 'whole',
	3: 'dotted-half',
	2: 'half',
	1.5: 'dotted-quarter',
	1: 'quarter',
	0.75: 'dotted-eighth',
	0.5: 'eighth',
	0.375: 'dotted-sixteenth',
	0.25: 'sixteenth',
	0.1875: 'dotted-thirtysecond',
	0.125: 'thirtysecond',
};

const noteTypeToQuarterNoteDuration: { [key in NoteType]: number } = {
	whole: 4,
	'dotted-half': 3,
	half: 2,
	'dotted-quarter': 1.5,
	quarter: 1,
	'dotted-eighth': 0.75,
	eighth: 0.5,
	'dotted-sixteenth': 0.375,
	sixteenth: 0.25,
	'dotted-thirtysecond': 0.1875,
	thirtysecond: 0.125,
};

// The duration of note with respect to a quarter note (i.e. an eighth note in 3/8 has duration 1, but in 4/4 it's 0.5)
export const getQuarterNoteDuration = (duration: number, beatNote: number) => {
	// Calculate what we need to multiply the duration by to get its quarter note duration
	const multiplier = 4 / beatNote;

	// Multiply the duration by the multiplier
	const quarterDuration = duration * multiplier;

	return quarterDuration;
};

export const durationToNoteType = (duration: number, beatNote: number) => {
	const quarterDuration = getQuarterNoteDuration(duration, beatNote);

	if (quarterDuration in quarterDurationToNoteType) {
		return quarterDurationToNoteType[quarterDuration];
	} else {
		console.error("Quarter duration doesn't have a type:\n ");
		console.error({ quarterDuration, duration });
		return 'quarter';
	}
};

export const getQuarterNoteDurationFromNoteType = (noteType: NoteType) => {
	if (noteType in noteTypeToQuarterNoteDuration) {
		return noteTypeToQuarterNoteDuration[noteType];
	} else {
		console.error('Note type not supported:\n ');
		console.error({ noteType });
		return 1;
	}
};

export const noteTypeIsDotted = (noteType: NoteType) =>
	noteType.startsWith('dotted-');

export const getNoteAnnotationKeys = () => {
	return [
		'accent',
		'accidental',
		'chord',
		'dotted',
		'dynamic',
		'slur',
		'staccato',
	] as (keyof Required<NoteAnnotations>)[];
};
