import { NoteAnnotations } from '@/types/music/note-annotations';
import { NoteAnnotationAssigner, MeasureAttributeAssigner } from '..';
import { Measure, Note, NoteType } from '@/components/providers/music/types';
import { ReactNode } from 'react';
import { MeasureAttributes } from '@/types/music';

export type SelectionMetadata<T> = {
	// If the 'value' key is present, that means at least 1 selection has that value
	// The 'allSelectionsHave' key determines if all the selections have the value 'value'
	[key in keyof T]: { value?: T[key]; allSelectionsHave: boolean };
};

export type AnnotationSelectionMetadata = SelectionMetadata<NoteAnnotations>;

// Example: { accent: { value: 'strong', allSelectionsHave: true } } -> at least 1 selection is able to have
// an accent assigned to it, and all the applicable selections have a 'strong' accent assigned
// Result: The accent assigner button should have the accent annotation removed from all applicable selections

// Example: { accidental: { value: undefined, allSelectionsHave: true } } -> at least 1 selection is able to have
// an accidental assigned to it, and all the applicable selections don't have the accidental annotation assigned
// Result: The accidental assigner button should add the selected accidental value to each applicable selection

// Example: No metadata -> There's no selections that are able to have an annotation assigned
// Result: Do nothing - assigner button should be disabled

export type AttributeSelectionMetadata = SelectionMetadata<MeasureAttributes>;

export interface IMusicAssignerButton {
	active?: boolean;
	assigner: NoteAnnotationAssigner | MeasureAttributeAssigner;
}

export interface INoteAnnotationAssignerButton<K extends keyof NoteAnnotations>
	extends IMusicAssignerButton {
	assigner: NoteAnnotationAssigner;
	// If selectionMetadata is not present, that means every selection doesn't have the ability to
	// have the note annotation assigned to it
	selectionMetadata?: AnnotationSelectionMetadata[K];
}

export interface IMeasureAssignerButton extends IMusicAssignerButton {
	assigner: MeasureAttributeAssigner;
}

export interface INotePlacementAssignerButton {
	assigner: (noteType: NoteType) => void;
	noteType: NoteType;
	children: ReactNode;
}

export type SelectionData = {
	measureIndex: number;
	attributes: MeasureAttributes;
	xStart: number;
	xEnd: number;
	y: number;
	noteIndex?: number;
	note?: Note;
};

export type CurriedAssigner = (
	measures: Measure[],
	selectionData: SelectionData[]
) => boolean;

export type AssignerLifter = (assigner: CurriedAssigner) => void;

export type AssignerExecuter = (assigner: CurriedAssigner) => void;
