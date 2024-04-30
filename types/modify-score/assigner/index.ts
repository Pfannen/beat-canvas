import { NoteAnnotations } from '@/types/music/note-annotations';
import { GenericAssigner } from '..';
import { Measure, NoteType } from '@/components/providers/music/types';
import { ReactNode } from 'react';
import { MeasureAttributes } from '@/types/music';
import { SegmentSelectionData, SelectionMetadata } from './metadata';

export interface IMusicAssignerComponent {
	disabled?: boolean;
	add?: boolean;
}

// If metadataEntry is not present, that means every selection doesn't have the ability to
// have the attribute / annotation assigned to it
export interface IGenericAssignerComponent<T, K extends keyof T> {
	assigner: GenericAssigner<T, K>;
	tKey: K;
	metadataEntry: SelectionMetadata<T>[K] | undefined;
	children: ReactNode;
	currentValue?: T[K];
}

// Use this interface when you create a component that is for a specific attribute / annotation
// (you won't need to take in the key, children, or current value because you should already know them)
export interface IKnownGenericAssignerComponent<T, K extends keyof T> {
	assigner: GenericAssigner<T, K>;
	metadataEntry: SelectionMetadata<T>[K] | undefined;
}

export interface IAnnotationAssignerComponent<K extends keyof NoteAnnotations>
	extends IGenericAssignerComponent<NoteAnnotations, K> {}

export interface IAttributeAssignerComponent<K extends keyof MeasureAttributes>
	extends IGenericAssignerComponent<MeasureAttributes, K> {}

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
	selectionData: SegmentSelectionData[]
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
