import { PitchOctave } from '@/types/music';
import {
	NoteAnnotation,
	NoteAnnotations,
	NoteAttributes,
	NoteAttributesModifier,
} from '@/types/music/note-annotations';

const staccatoApplier: NoteAttributesModifier = (attr, annotations) => {
	if (annotations.staccato) attr.duration /= 2;
};

const slurApplier: NoteAttributesModifier = (attr, annotations) => {
	const { slur } = annotations;
	if (!slur) return;

	const { instrumentProps: iP } = attr;
	if (slur === 'start') iP.portamento = 0.2;
	else iP.portamento = 0;
};

const accidentalApplier: NoteAttributesModifier = (attr, annotations) => {
	const { accidental } = annotations;
	if (accidental) {
		if (accidental === 'flat') attr.pitchOctave.accidental = 'b';
		else if (accidental === 'sharp') attr.pitchOctave.accidental = '#';
		else delete attr.pitchOctave.accidental;
	}
};

const accentApplier: NoteAttributesModifier = (attr, annotations) => {
	const { accent } = annotations;
	if (accent) {
		accent === 'weak' ? (attr.velocity = 0.4) : (attr.velocity = 0.5);
	}
};

const dynamicApplier: NoteAttributesModifier = (attr, annotations) => {
	const { dynamic } = annotations;
	if (dynamic) {
		if (dynamic[0] === 'p') attr.volumePercentage = 0.2;
		else if (dynamic[0] === 'm') attr.volumePercentage = 0.5;
		else attr.volumePercentage = 0.8;
	}
};

export const applyNoteAnnotations = (
	noteAttributes: NoteAttributes,
	annotations?: NoteAnnotations
) => {
	if (!annotations) return;

	const keys = Object.keys(annotations) as (keyof NoteAnnotations)[];
	for (const key of keys) {
		annotationApplier[key](noteAttributes, annotations);
	}
};

export const annotationApplier: {
	[key in NoteAnnotation]: NoteAttributesModifier;
} = {
	staccato: staccatoApplier,
	slur: slurApplier,
	accidental: accidentalApplier,
	accent: accentApplier,
	dynamic: dynamicApplier,
};

export const constructNoteAttributes = (
	pitchOctave: PitchOctave,
	duration: number,
	volumePercentage?: number,
	velocity?: number
) => {
	const nA: NoteAttributes = {
		pitchOctave,
		volumePercentage: volumePercentage || 1,
		velocity: velocity || 0.3,
		duration,
		instrumentProps: {},
	};
	return nA;
};

export const getFullNote = (pitchOctave: PitchOctave) => {
	const { pitch, octave, accidental } = pitchOctave;
	return pitch + (accidental || '') + octave;
};
