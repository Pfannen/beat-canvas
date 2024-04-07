import { NoteAnnotations } from '@/types/music/note-annotations';
import { NoteAnnotationAssigner, MeasureAttributeAssigner } from '..';
import { Note, NoteType } from '@/components/providers/music/types';
import { ReactNode } from 'react';

export interface IMusicAssignerButton {
	active?: boolean;
	assigner: NoteAnnotationAssigner | MeasureAttributeAssigner;
}

export interface INoteAnnotationAssignerButton extends IMusicAssignerButton {
	assigner: NoteAnnotationAssigner;
	annotations?: NoteAnnotations;
}

export interface IMeasureAssignerButton extends IMusicAssignerButton {
	assigner: MeasureAttributeAssigner;
}

export interface INotePlacementAssignerButton {
	assigner: (noteType: NoteType) => void;
	noteType: NoteType;
	children: ReactNode;
}

export type PlacementData = {
	measureIndex: number;
	x: number;
	y: number;
	noteIndex?: number;
};

export type ExecuteAssignerDelegate = (
	assigner: (placementData: PlacementData) => boolean
) => void;
