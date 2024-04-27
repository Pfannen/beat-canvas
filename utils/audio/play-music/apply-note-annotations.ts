import { PitchOctave } from '@/types/music';
import {
	NoteAnnotation,
	NoteAnnotations,
	NoteEnqueueData,
	NoteAnnotationApplier,
	InstrumentAttributes,
	NoteAnnotationApplierMap,
} from '@/types/music/note-annotations';

const staccatoApplier: NoteAnnotationApplier = (attr, annotations) => {
	if (!annotations.staccato) return;

	attr.duration /= 2;
	const { preNote } = attr.persistentAttributes;
	preNote.envelope.release = 0.5;
};

const slurApplier: NoteAnnotationApplier = (attr, annotations) => {
	const { slur } = annotations;
	if (!slur) return;

	const { preNote, postNote } = attr.persistentAttributes;
	if (slur.start !== undefined) {
		postNote.envelope.decay = 0.0000001;
		postNote.envelope.attack = 0;
	} else {
		postNote.envelope.decay = 0.1;
		postNote.envelope.attack = 0.005;
	}
};

const accidentalApplier: NoteAnnotationApplier = (attr, annotations) => {
	const { accidental } = annotations;
	if (accidental) {
		if (accidental === 'flat') attr.pitchOctave.accidental = 'b';
		else if (accidental === 'sharp') attr.pitchOctave.accidental = '#';
		else delete attr.pitchOctave.accidental;
	}
};

const accentApplier: NoteAnnotationApplier = (attr, annotations) => {
	const { accent } = annotations;
	if (!accent) return;

	const { persistentAttributes: pA } = attr;
	const curVelocity = pA.cur.velocity;
	let newVelocity = Math.max(1, curVelocity * 1.1);
	if (accent === 'strong') newVelocity = Math.max(1, curVelocity * 1.25);

	pA.preNote.velocity = newVelocity;
};

const dynamicApplier: NoteAnnotationApplier = (attr, annotations) => {
	const { dynamic } = annotations;
	if (!dynamic) return;

	const { preNote, postNote } = attr.persistentAttributes;
	let newVelocity = 0.2;
	if (dynamic[0] === 'm') newVelocity = 0.5;
	else newVelocity = 0.8;

	console.log('dynamic change ' + dynamic);
	preNote.velocity = newVelocity;
	postNote.velocity = newVelocity;
};

// Right now, we specify dotted in the type, which is used to already compute duration
// This should change
const dottedApplier: NoteAnnotationApplier = (attr, annotations) => {
	return;
	const { dotted } = annotations;
	if (!dotted) return;

	attr.duration += attr.duration / 2;
};

export const applyNoteAnnotations = (
	noteEnqueueData: NoteEnqueueData,
	annotations?: NoteAnnotations
) => {
	if (!annotations) return;

	const keys = Object.keys(annotations) as (keyof NoteAnnotations)[];
	for (const key of keys) {
		applierMap[key](noteEnqueueData, annotations);
	}
};

export const applierMap: NoteAnnotationApplierMap = {
	staccato: staccatoApplier,
	slur: slurApplier,
	accidental: accidentalApplier,
	accent: accentApplier,
	dynamic: dynamicApplier,
	dotted: dottedApplier,
	chord: () => {},
};

export const constructNoteAttributes = (
	pitchOctave: PitchOctave,
	duration: number,
	curPersistent: InstrumentAttributes
) => {
	const nA: NoteEnqueueData = {
		pitchOctave,
		duration,
		persistentAttributes: {
			cur: curPersistent,
			preNote: { envelope: {} },
			postNote: { envelope: {} },
		},
	};
	return nA;
};

export const getFullNote = (pitchOctave: PitchOctave) => {
	const { pitch, octave, accidental } = pitchOctave;
	return pitch + (accidental || '') + octave;
};
