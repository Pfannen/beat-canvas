import { Note } from '@/components/providers/music/types';
import { MeasureAttributes } from '.';
import { NoteAnnotations } from './note-annotations';

export type PartLocationInfo = {
	currentAttributes: MeasureAttributes;
	measureStartX: number;
	curX: number;
	measureIndex: number;
	newAttributes?: Partial<MeasureAttributes>;
	note?: Note;
	completedDurationAttributes?: DurationAttributeInfo;
};

export type DurationAttributeInfo = {
	slur?: SlurDurationInfo[];
	wedge?: WedgeDurationInfo;
};

export type StartDurationInfo = {
	measureStartIndex: number;
	xStart: number;
	secondsStart: number;
};

export type EndDurationInfo = {
	measureEndIndex: number;
	xEnd: number;
	secondsEnd: number;
};

export type BaseDurationInfo = StartDurationInfo & EndDurationInfo;

export type SlurDurationInfo = BaseDurationInfo & {
	maxYPos: number;
	minYPos: number;
};

export type WedgeDurationInfo = BaseDurationInfo & {
	crescendo: boolean;
};

export type TBCDurationAttributeInfo = {
	slur?: TBCSlurDurationInfo[];
	wedge?: TBCWedgeDurationInfo;
};

export type TBCSlurDurationInfo = StartDurationInfo & {
	maxYPos: number;
	minYPos: number;
	slurId: number;
};

export type TBCWedgeDurationInfo = StartDurationInfo & {
	crescendo: boolean;
};

export type OptionalLocationProperties = {
	note?: Note;
	newAttributes?: Partial<MeasureAttributes>;
};

export type DurationAttributeInfoUpdater<
	K extends keyof DurationAttributeInfo,
	T extends keyof NoteAnnotations | keyof MeasureAttributes
> = (
	tbcDurationEntry: TBCDurationAttributeInfo[K],
	durItem: (NoteAnnotations & MeasureAttributes)[T],
	measureIndex: number,
	x: number,
	seconds: number,
	note?: Note
) => {
	completed?: DurationAttributeInfo[K];
	updatedEntry: TBCDurationAttributeInfo[K];
};
