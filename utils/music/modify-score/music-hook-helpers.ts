import { MeasureFetcher } from '@/components/providers/music/hooks/useMeasures/utils';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { modifyNoteAnnotation } from './note';
import { MeasureAttributes } from '@/types/music';
import { modifyMeasureAttribute } from './measures';
import { CurriedAssigner, SelectionData } from '@/types/modify-score/assigner';
import { Note, NoteType } from '@/components/providers/music/types';
import { NotePlacementValidator } from '@/types/modify-score';

export const modifyNoteAnnotationAdapter =
	<K extends keyof NoteAnnotations>(
		annotationName: K,
		annotationValue: NoteAnnotations[K] | undefined,
		measureIndex: number,
		noteIndex: number
	) =>
	(getMeasures: MeasureFetcher) => {
		// Get the correct measure
		const measures = getMeasures(measureIndex, 1);
		// Check if the measure actually exists
		if (!measures.length) return false;

		// Extract the measure
		const measure = measures[0];
		// Check if the note actually exists
		if (measure.notes.length >= noteIndex) return false;

		// Extract the note
		const note = measure.notes[noteIndex];
		// Modify the note's annotation
		modifyNoteAnnotation(note, annotationName, annotationValue);
		return true;
	};

export const modifyMeasureAttributesAdapter =
	<K extends keyof MeasureAttributes>(
		attributeName: K,
		attributeValue: MeasureAttributes[K] | undefined,
		measureIndex: number,
		xPos: number
	) =>
	(getMeasures: MeasureFetcher) => {
		// Get the correct measure
		const measures = getMeasures(measureIndex, 1);
		// Check if the measure actually exists
		if (!measures.length) return false;

		// Modify the measure's attribute
		modifyMeasureAttribute(xPos, measures, 0, attributeName, attributeValue);
	};

export const curriedModifyNoteAnnotation =
	<K extends keyof NoteAnnotations>(
		annotationName: K,
		annotationValue: NoteAnnotations[K] | undefined
	): CurriedAssigner =>
	(measures, selectionData) => {
		if (!measures.length || !selectionData.length) return false;

		const notes: Note[] = [];
		selectionData.forEach(({ measureIndex, noteIndex }) => {
			if (noteIndex === undefined) return;

			const measure = measures[measureIndex];
			if (measure.notes.length < noteIndex) {
				notes.push(measure.notes[noteIndex]);
			}
		});

		if (notes.length === 0) return false;

		notes.forEach((note) => {
			modifyNoteAnnotation(note, annotationName, annotationValue);
		});

		return true;
	};

export const curriedModifyMeasureAttribute =
	<K extends keyof MeasureAttributes>(
		attributeName: K,
		attributeValue: MeasureAttributes[K] | undefined
	): CurriedAssigner =>
	(measures, selectionData) => {
		if (!measures.length || !selectionData.length) return false;

		selectionData.forEach(({ measureIndex, xStart }) => {
			modifyMeasureAttribute(
				xStart,
				measures,
				measureIndex,
				attributeName,
				attributeValue
			);
		});

		return true;
	};

// TODO: Make these actual methods
const placeNote = (notes: Note[], note: Note) => {};
const destroyNote = (notes: Note[], x: number) => {};

export const curriedPlaceNote =
	(
		noteType: NoteType,
		notePlacementValidator?: NotePlacementValidator
	): CurriedAssigner =>
	(measures, selectionData) => {
		if (notePlacementValidator) {
			// place notes
			selectionData.forEach(({ measureIndex, xStart, y }) => {
				const { notes } = measures[measureIndex];
				if (notePlacementValidator(notes, xStart)) {
					const note: Note = {
						x: xStart,
						y,
						type: noteType,
					};
					placeNote(notes, note);
				}
			});
		} else {
			selectionData.forEach(({ measureIndex, xStart }) => {
				destroyNote(measures[measureIndex].notes, xStart);
			});
		}
		return true;
	};
