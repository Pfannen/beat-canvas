import Tone from 'tone';
import { PitchOctave } from '.';

export type NoteAnnotation =
	| 'accent'
	| 'staccato'
	| 'slur'
	| 'dynamic'
	| 'accidental'
	| 'chord';

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
	chord?: true;
	dotted?: true;
};

export type PersistentInstrumentAttributes = {
	instrumentProps: InstrumentProps;
	velocity: number;
};

export type PartialPIA = {
	instrumentProps: Partial<InstrumentProps>;
	velocity?: number;
};

export type NoteEnqueueData = {
	pitchOctave: PitchOctave;
	duration: number;
	persistentAttributes: {
		cur: PersistentInstrumentAttributes;
		applyToNote: PartialPIA;
		persist: PartialPIA;
	};
};

export type NoteAnnotationApplier = (
	noteEnqueueData: NoteEnqueueData,
	annotations: NoteAnnotations
) => void;

export type NoteAnnotationApplierMap = {
	[key in NoteAnnotation]: NoteAnnotationApplier;
};
