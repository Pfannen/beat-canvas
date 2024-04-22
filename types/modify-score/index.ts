import {
	Note,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import { MeasureAttributes } from '../music';
import { NoteAnnotations } from '../music/note-annotations';

// K: A key of T
// T: Some object that has keys
// A function that takes in a key of an object and a valid value for that key, or undefined
// Because the object K derives from is not passed in as well, it's used as a function with side effects
// that modifies state not taken in its parameters
export type GenericAssigner<T, K extends keyof T> = (
	key: K,
	value?: T[K]
) => void;

// Generic assigner for note annotations
export type NoteAnnotationAssigner = GenericAssigner<
	NoteAnnotations,
	keyof NoteAnnotations
>;

// Generic assigner for measure attributes
export type MeasureAttributeAssigner = GenericAssigner<
	MeasureAttributes,
	keyof MeasureAttributes
>;

// Returns the index where the note should be placed, or -1 if it can't be placed
export type NotePlacementValidator = (
	notes: Note[],
	x: number,
	noteType: NoteType,
	timeSignature: TimeSignature
) => number;

// Places the given note into the note array after checking against the given validator
// X position is given in the note and the time signature is needed for valid placement checkings
export type NotePlacer = (
	note: Note,
	notes: Note[],
	placementValidator: NotePlacementValidator,
	timeSignature: TimeSignature
) => boolean;

// Identifies a position in a score
export type ScorePositionID = {
	measureIndex: number;
	x: number;
	y?: number;
};
