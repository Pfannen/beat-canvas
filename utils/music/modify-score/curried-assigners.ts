import { MeasureFetcher } from '@/components/providers/music/hooks/useMeasures/utils';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { addSlur, modifyNoteAnnotation, removeSlur } from './note';
import { MeasureAttributes } from '@/types/music';
import { modifyMeasureAttribute } from './measures';
import {
	AssignerCurrier,
	CurriedAssigner,
	SpecialAssignerMap,
} from '@/types/modify-score/assigner';
import { Note, NoteType } from '@/components/providers/music/types';
import { NotePlacementValidator } from '@/types/modify-score';
import { placeNote, removeNote } from '../note-placement';
import { indexIsValid } from '@/utils';
import { specialAnnotationModifiers } from './special-assigners';

// #region Annotations

export const curriedModifyNoteAnnotation = <K extends keyof NoteAnnotations>(
	annotationName: K,
	annotationValue: NoteAnnotations[K] | undefined
): CurriedAssigner => {
	// If the annotation needing to be modified requires a special, non-generalized function,
	// use the one in the map
	if (annotationName in specialAnnotationModifiers) {
		return specialAnnotationModifiers[annotationName](
			annotationName,
			annotationValue
		);
	}

	// Else use this general assigner function that simply adds or removes the annotation along with the given value
	const baseAssigner: CurriedAssigner = (measures, selectionData) => {
		if (!measures.length || !selectionData.length) return false;

		const notes: Note[] = [];
		selectionData.forEach(({ measureIndex, noteIndex }) => {
			if (noteIndex === undefined) return;

			const measure = measures[measureIndex];
			if (noteIndex < measure.notes.length) {
				notes.push(measure.notes[noteIndex]);
			}
		});

		if (notes.length === 0) return false;

		notes.forEach((note) => {
			modifyNoteAnnotation(note, annotationName, annotationValue);
		});

		return true;
	};

	return baseAssigner;
};

// #endregion

// #region Attributes

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

// #endregion

// #region Note placement

// If notePlacementValidator isn't present, that means the notes within the selection data
// should be removed, and noteType has no effect
export const curriedPlaceNote =
	(
		noteType: NoteType,
		notePlacementValidator?: NotePlacementValidator
	): CurriedAssigner =>
	(measures, selectionData) => {
		let measuresModified = false;

		if (notePlacementValidator) {
			// place notes
			selectionData.forEach(
				({ measureIndex, xStart, y, rollingAttributes: { timeSignature } }) => {
					const { notes } = measures[measureIndex];
					const note: Note = {
						x: xStart,
						y,
						type: noteType,
					};

					if (
						placeNote(
							note,
							notes,
							notePlacementValidator,
							timeSignature,
							note.annotations?.dotted
						)
					)
						measuresModified = true;
				}
			);
		} else {
			selectionData.forEach(({ measureIndex, note }) => {
				if (!note) return;
				if (removeNote(measures[measureIndex].notes, note.x))
					measuresModified = true;
			});
		}

		return measuresModified;
	};

// #endregion

/* export const modifyNoteAnnotationAdapter =
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
	}; */

/* export const modifyMeasureAttributesAdapter =
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
	}; */
