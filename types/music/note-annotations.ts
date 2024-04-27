import { PitchOctave } from '.';

export type NoteAnnotation =
	| 'accent'
	| 'staccato'
	| 'slur'
	| 'dynamic'
	| 'accidental'
	| 'dotted'
	| 'chord';

export type Slur = { start?: number; stop?: number[] };

export type SlurMXMLImport = 'start' | 'stop';

export type Accent = 'strong' | 'weak';

export type Dynamic =
	| 'ppp'
	| 'pp'
	| 'p'
	| 'mp'
	| 'mf'
	| 'fp'
	| 'f'
	| 'ff'
	| 'fff';

export type Accidental = 'sharp' | 'flat' | 'natural';

export type InstrumentEnvelope = {
	attack: number;
	sustain: number;
	decay: number;
	release: number;
};

export type NoteAnnotations = {
	staccato?: boolean;
	slur?: Slur;
	accent?: Accent;
	dynamic?: Dynamic;
	accidental?: Accidental;
	chord?: true;
	dotted?: true;
};

export type InstrumentAttributes = {
	envelope: InstrumentEnvelope;
	velocity: number;
	portamento: number;
};

export type PartialIA = {
	envelope: Partial<InstrumentEnvelope>;
	velocity?: number;
	portamento?: number;
};

export type NoteEnqueueData = {
	pitchOctave: PitchOctave;
	duration: number;
	persistentAttributes: {
		cur: InstrumentAttributes;
		preNote: PartialIA;
		postNote: PartialIA;
	};
};

export type NoteAnnotationApplier = (
	noteEnqueueData: NoteEnqueueData,
	annotations: NoteAnnotations
) => void;

export type NoteAnnotationApplierMap = {
	[key in keyof Required<NoteAnnotations>]: NoteAnnotationApplier;
};
