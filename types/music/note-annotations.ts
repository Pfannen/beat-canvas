import Tone from 'tone';
import { PitchOctave } from '.';

export type NoteAnnotation =
	| 'accent'
	| 'staccato'
	| 'slur'
	| 'dynamic'
	| 'accidental';

export type Slur = 'start' | 'stop';

export type Accent = 'strong' | 'weak';

export type Dynamic = 'pp' | 'p' | 'mp' | 'mf' | 'fp' | 'f' | 'ff';

export type Accidental = 'sharp' | 'flat' | 'natural';

export type InstrumentProps = {
	attack: number;
	sustain: number;
	decay: number;
	release: number;
	portamento: number;
};

export type NoteAnnotations = {
	staccato?: boolean;
	slur?: Slur;
	accent?: Accent;
	dynamic?: Dynamic;
	accidental?: Accidental;
};

export type NoteAttributes = {
	pitchOctave: PitchOctave;
	velocity: number;
	duration: number;
	instrumentProps: Partial<InstrumentProps>;
	volumePercentage?: number;
};

export type NoteAttributesModifier = (
	noteAttributes: NoteAttributes,
	annotations: NoteAnnotations
) => void;

/* type AnnotationModifier<
	T extends NoteAttributes,
	K extends keyof NoteAnnotations
> = (attributes: T, annotation: { [key in K]: NoteAnnotations[K] }) => T;

// Example modifier functions
const staccatoModifier: AnnotationModifier<NoteAttributes, 'staccato'> = (
	attributes,
	annotation
) => {
	// Your staccato logic here
	return {
		...attributes,
		duration: annotation?.staccato?.duration || attributes.duration,
	};
};

const slurModifier: AnnotationModifier<NoteAttributes, 'slur'> = (
	attributes,
	annotation
) => {
	// Your slur logic here
	return attributes;
};

const accentModifier: AnnotationModifier<NoteAttributes, 'accent'> = (
	attributes,
	annotation
) => {
	// Your accent logic here
	return {
		...attributes,
		volume: annotation?.accent?.strength === 'strong' ? 1.0 : 0.8,
	};
};

const dynamicsModifier: AnnotationModifier<NoteAttributes, 'dynamics'> = (
	attributes,
	annotation
) => {
	// Your dynamics logic here
	return attributes;
};

// Example usage
const note: NoteAttributes = {
	pitchOctave: 'C4',
	volume: 0.8,
	velocity: 0.5,
	duration: 2,
};

const annotationMap: {
	[key in NoteAnnotation]: AnnotationModifier<NoteAttributes, key>;
} = {
	accent: accentModifier,
	slur: slurModifier,
	dynamics: dynamicsModifier,
	staccato: staccatoModifier,
};

const annotations: NoteAnnotations = {
	staccato: { duration: 0.5 },
	accent: { strength: 'strong' },
}; */
