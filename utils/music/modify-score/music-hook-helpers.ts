import { MeasureFetcher } from '@/components/providers/music/hooks/useMeasures/utils';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { modifyNoteAnnotation } from './note';
import { MeasureAttributes } from '@/types/music';
import { modifyMeasureAttribute } from './measures';

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
