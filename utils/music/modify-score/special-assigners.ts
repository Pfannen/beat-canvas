import {
	AssignerCurrier,
	CurriedAssigner,
	SpecialAssignerMap,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { indexIsValid } from '@/utils';
import { addSlur, modifyNoteAnnotation, removeSlur } from './note';

// A function that curries an assigner function for modifying slur annotations
const curriedModifySlur: AssignerCurrier<NoteAnnotations, 'slur'> = (
	annotationName,
	annotationValue
) => {
	const slurAssigner: CurriedAssigner = (measures, selectionData) => {
		// It's required that there only be 2 selections and both selections have a note
		if (
			selectionData.length !== 2 ||
			selectionData[0].noteIndex === undefined ||
			selectionData[1].noteIndex === undefined
		) {
			console.log('Must have two notes to slur');
			return false;
		}

		// Extract required properties
		const { measureIndex: mIdx1, noteIndex: nIdx1 } = selectionData[0];
		const note1 = measures[mIdx1].notes[nIdx1];
		const { measureIndex: mIdx2, noteIndex: nIdx2 } = selectionData[1];
		const note2 = measures[mIdx2].notes[nIdx2];

		// Either add or remove a slur
		if (annotationValue) {
			const success = addSlur(note1, mIdx1, note2, mIdx2);
			return success;
		} else {
			return removeSlur(note1, note2);
		}
	};

	return slurAssigner;
};

const curreidModifyDotted: AssignerCurrier<NoteAnnotations, 'dotted'> = (
	annotationName,
	applyDotted
) => {
	const dottedAssigner: CurriedAssigner = (measures, selectionData) => {
		let updatedDotted = false;

		selectionData.forEach((selection) => {
			const {
				measureIndex,
				noteIndex,
				rollingAttributes: { timeSignature },
				dottedValidator,
			} = selection;
			console.log({ dottedValidator });

			if (
				noteIndex === undefined ||
				!indexIsValid(measureIndex, measures.length)
			) {
				return;
			}

			const { notes } = measures[measureIndex];
			if (!indexIsValid(noteIndex, notes.length)) return;

			const note = notes[noteIndex];
			if (applyDotted && dottedValidator(notes, noteIndex, timeSignature)) {
				modifyNoteAnnotation(note, 'dotted', true);
				updatedDotted = true;
			} else {
				modifyNoteAnnotation(note, 'dotted', undefined);
				updatedDotted = true;
			}
		});

		return updatedDotted;
	};

	return dottedAssigner;
};

export const specialAnnotationModifiers: SpecialAssignerMap<NoteAnnotations> = {
	slur: curriedModifySlur,
	dotted: curreidModifyDotted,
};
