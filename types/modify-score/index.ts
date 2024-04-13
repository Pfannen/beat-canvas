import {
	Note,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import { MeasureAttributes } from '../music';
import { NoteAnnotations } from '../music/note-annotations';

export type NoteAnnotationAssigner = <K extends keyof NoteAnnotations>(
	key: K,
	value?: NoteAnnotations[K]
) => void;

export type MeasureAttributeAssigner = <K extends keyof MeasureAttributes>(
	key: K,
	value?: MeasureAttributes[K]
) => void;

// Returns the index where the note should be placed, or -1 if it can't be placed
export type NotePlacementValidator = (
	notes: Note[],
	x: number,
	noteType: NoteType,
	timeSignature: TimeSignature
) => number;

// X position is given in the note
export type NotePlacer = (
	note: Note,
	notes: Note[],
	placementValidator: NotePlacementValidator,
	timeSignature: TimeSignature
) => boolean;
