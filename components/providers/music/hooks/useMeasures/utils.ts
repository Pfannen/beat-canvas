import { TimeSignature, Measure, Note } from '../../types';
import { getNoteDuration } from '../../utils';

export type MeasureFetcher = (index?: number, count?: number) => Measure[];

export type MeasureModifier<T> = (
	args: T
) => (getMeasures: MeasureFetcher) => boolean | void;

export const addNote: MeasureModifier<{ note: Note; measureIndex: number }> =
	({ note, measureIndex }) =>
	(getMeasures) => {
		const measure = getMeasures(measureIndex, 1)[0];
		const timeSignature = {
			beatNote: 4,
			beatsPerMeasure: 4,
		};
		const noteIndex = findPositionIndex(note.x, measure.notes);
		if (!isValidPlacement(note, measure, timeSignature, noteIndex)) {
			console.error('Invalid note placement', note.x);
			return false;
		}
		measure.notes.splice(noteIndex, 0, note);
	};

export const removeNote: MeasureModifier<{
	noteIndex: number;
	measureIndex: number;
}> =
	({ noteIndex, measureIndex }) =>
	(getMeasures) => {
		getMeasures(measureIndex)[0].notes.splice(noteIndex, 1);
	};

export const createMeasure: MeasureModifier<{
	notes?: Note[];
	insertIndex?: number;
}> =
	({ notes, insertIndex }) =>
	(getMeasures) => {
		const measures = getMeasures();
		insertIndex = insertIndex === undefined ? measures.length : insertIndex;
		measures.splice(insertIndex!, 0, { notes: notes || [] });
	};

export const removeMeasures: MeasureModifier<{
	startIndex: number;
	count: number;
}> =
	({ startIndex, count }) =>
	(getMeasures) => {
		getMeasures().splice(startIndex, count);
	};

export const duplicateMeasures: MeasureModifier<{
	startIndex: number;
	count: number;
	insertIndex?: number;
}> =
	({ startIndex, count, insertIndex }) =>
	(getMeasures) => {
		const measures = getMeasures();
		const duplicatedMeasures = measures.slice(startIndex, startIndex + count);
		measures.splice(insertIndex || measures.length, 0, ...duplicatedMeasures);
	};

const isValidPlacement = (
	note: Note,
	measure: Measure,
	timeSignature: TimeSignature,
	noteIndex?: number
) => {
	const noteDuration = getNoteDuration(note.type, timeSignature.beatNote);
	if (measure.notes.length === 0) {
		return note.x + noteDuration <= timeSignature.beatNote;
	}
	const { notes } = measure;
	if (noteIndex === undefined) {
		noteIndex = findPositionIndex(note.x, notes);
	}
	const foundNote = notes[noteIndex];
	const prevNote = notes[noteIndex - 1];
	const lowerBound = prevNote
		? prevNote.x + getNoteDuration(prevNote.type, timeSignature.beatNote)
		: 0;
	const upperBound = foundNote ? foundNote.x : timeSignature.beatsPerMeasure;
	return lowerBound <= note.x && note.x + noteDuration <= upperBound;
};

export const findPositionIndex = (xPos: number, notes: Note[]) => {
	let start = 0;
	let end = notes.length;
	while (start < end) {
		const mid = Math.floor((start + end) / 2);
		const midXPos = notes[mid].x;
		if (midXPos === xPos) return mid;
		if (xPos < midXPos) {
			end = mid;
		} else {
			start = mid + 1;
		}
	}
	return end;
};
