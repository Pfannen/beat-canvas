import { Note } from '@/components/providers/music/types';
import { MeasureAttributes } from '.';
import { NoteAnnotations } from './note-annotations';

export type PartLocationInfo = {
	currentAttributes: MeasureAttributes;
	// The cumuluative x position that the measure started on
	measureStartX: number;
	curX: number;
	measureIndex: number;
	// The x position of the last yielded note of the current measure
	lastNoteXEnd: number;
	// If it's the start of a measure
	measureStart?: boolean;
	// If it's the end of a measure
	measureEnd?: boolean;
	// The new attributes at the current x position
	newAttributes?: Partial<MeasureAttributes>;
	// The note at the current x position
	note?: Note;
	// The duration attributes that have completed at the current x position
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
	startNoteYPos: number;
	endNoteYPos: number;
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
	startNoteYPos: number;
	slurId: number;
};

export type TBCWedgeDurationInfo = StartDurationInfo & {
	crescendo: boolean;
};

type RequiredLocationPropertyKeys =
	| 'currentAttributes'
	| 'measureStartX'
	| 'curX'
	| 'measureIndex'
	| 'lastNoteXEnd';

export type RequiredLocationProperties = {
	[key in RequiredLocationPropertyKeys]: PartLocationInfo[key];
};

type OptionalLocationPropertyKeys =
	| 'note'
	| 'newAttributes'
	| 'measureStart'
	| 'measureEnd';

export type OptionalLocationProperties = {
	[key in OptionalLocationPropertyKeys]?: PartLocationInfo[key];
};

export type DurationAttributeInfoUpdater<K extends DurationAttributeKey> = (
	tbcDurationEntry: TBCDurationAttributeInfo[K],
	durItem: (NoteAnnotations & MeasureAttributes)[K],
	measureIndex: number,
	x: number,
	seconds: number,
	note?: Note
) => DurationInfoUpdaterReturn<K>;

export type DurationInfoUpdaterReturn<K extends DurationAttributeKey> = {
	completed?: DurationAttributeInfo[K];
	updatedEntry: TBCDurationAttributeInfo[K];
};

export type DurationAttributeKey = keyof DurationAttributeInfo;
