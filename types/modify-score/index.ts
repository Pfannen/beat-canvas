import { Note } from '@/components/providers/music/types';
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

export type NotePlacementValidator = (notes: Note[], x: number) => boolean;
