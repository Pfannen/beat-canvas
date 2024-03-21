import { PitchOctave } from '@/types/music';
import {
	NoteAnnotation,
	NoteAnnotations,
	NoteAudioAttributes,
	NoteAttributesModifier,
	PersistentInstrumentAttributes,
} from '@/types/music/note-annotations';

const staccatoApplier: NoteAttributesModifier = (attr, annotations) => {
	if (!annotations.staccato) return;

	attr.duration /= 2;
	const { applyToNote } = attr.persistentAttributes;
	applyToNote.instrumentProps.release = 0.5;
};

const slurApplier: NoteAttributesModifier = (attr, annotations) => {
	const { slur } = annotations;
	if (!slur) return;

	const { applyToNote, persist } = attr.persistentAttributes;
	if (slur === 'start') {
		persist.instrumentProps.decay = 0.00001;
		persist.instrumentProps.attack = 0;
	} else {
		persist.instrumentProps.decay = 0.1;
		persist.instrumentProps.attack = 0.005;
	}
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
	if (!accent) return;

	const { persistentAttributes: pA } = attr;
	const curVelocity = pA.cur.velocity;
	let newVelocity = Math.max(1, curVelocity * 1.1);
	if (accent === 'strong') newVelocity = Math.max(1, curVelocity * 1.25);

	pA.applyToNote.velocity = newVelocity;
};

const dynamicApplier: NoteAttributesModifier = (attr, annotations) => {
	const { dynamic } = annotations;
	if (!dynamic) return;

	const { applyToNote, persist } = attr.persistentAttributes;
	let newVelocity = 0.2;
	if (dynamic[0] === 'm') newVelocity = 0.5;
	else newVelocity = 0.8;

	console.log('dynamic change ' + dynamic);
	applyToNote.velocity = newVelocity;
	persist.velocity = newVelocity;
};

export const applyNoteAnnotations = (
	noteAttributes: NoteAudioAttributes,
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
	curPersistent: PersistentInstrumentAttributes
) => {
	const nA: NoteAudioAttributes = {
		pitchOctave,
		duration,
		persistentAttributes: {
			cur: curPersistent,
			applyToNote: { instrumentProps: {} },
			persist: { instrumentProps: {} },
		},
	};
	return nA;
};

export const getFullNote = (pitchOctave: PitchOctave) => {
	const { pitch, octave, accidental } = pitchOctave;
	return pitch + (accidental || '') + octave;
};
