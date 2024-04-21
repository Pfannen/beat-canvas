import { NoteAnnotations } from '@/types/music/note-annotations';
import { NoteAnnotationAssigner, MeasureAttributeAssigner } from '..';
import { Measure, Note, NoteType } from '@/components/providers/music/types';
import { ReactNode } from 'react';
import { MeasureAttributes } from '@/types/music';
import {
	AnnotationSelectionMetadata,
	AttributeSelectionMetadata,
	SelectionData,
} from './metadata';

export interface IMusicAssignerComponent {
	disabled?: boolean;
	add?: boolean;
}

export interface IAnnotationAssignerComponent<K extends keyof NoteAnnotations> {
	assigner: NoteAnnotationAssigner;
	// If annotationMetadata is not present, that means every selection doesn't have the ability to
	// have the note annotation assigned to it
	annotationMetadata?: AnnotationSelectionMetadata[K];
}

export interface IAnnotationAssignerComponent2<
	K extends keyof NoteAnnotations
> {
	assigner: NoteAnnotationAssigner;
	annotationName: K;
	metadataEntry: AnnotationSelectionMetadata[K] | undefined;
	children: ReactNode;
}

export interface IAttributeAssignerComponent<
	K extends keyof MeasureAttributes
> {
	assigner: MeasureAttributeAssigner;
	attributeMetadata?: AttributeSelectionMetadata[K];
}

export interface INotePlacementAssignerComponent
	extends IMusicAssignerComponent {
	assigner: (noteType: NoteType, placeNote?: boolean) => void;
	noteType?: NoteType;
	children: ReactNode;
}

// A function that curries an assigner function
export type AssignerCurrier<T, K extends keyof T> = (
	key: K,
	value: T[K] | undefined
) => CurriedAssigner;

// An assigner function is a function that takes in an array of measures along
// with an array of selection data and does something to the data. The reason for the
// currying is so that the function knows how to manipulate its given data while allowing
// outside entities only needing to give it the measures and selection data.
export type CurriedAssigner = (
	measures: Measure[],
	selectionData: SelectionData[]
) => boolean;

// An object that points from keys of the given type to a function
// that curries an assigner function for the key
export type SpecialAssignerMap<T> = {
	[key in keyof T]: AssignerCurrier<T, key>;
};

// A function that hoists an assigner function
export type AssignerLifter = (assigner: CurriedAssigner) => void;

// A function that executes an assigner function
export type AssignerExecuter = (assigner: CurriedAssigner) => void;

// A set representing valid note placements (typically resulting from inspecting selection data)
// The 'r' is used to denote that notes in the selection can also be removed
export type ValidNotePlacements = Set<NoteType | 'r'>;
