import {
	NoteAnnotation,
	NoteAttributesModifier,
} from '@/types/music/note-annotations';

const staccatoApplier: NoteAttributesModifier = (attr, annotations) => {
	if (annotations.staccato) attr.duration /= 2;
};

const slurApplier: NoteAttributesModifier = (attr, annotations) => {
	console.log('slur');
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
		accent === 'weak' ? (attr.velocity = 0.8) : (attr.velocity = 1);
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

const annotationApplier: { [key in NoteAnnotation]: NoteAttributesModifier } = {
	staccato: staccatoApplier,
	slur: slurApplier,
	accidental: accidentalApplier,
	accent: accentApplier,
	dynamic: dynamicApplier,
};

export default annotationApplier;
