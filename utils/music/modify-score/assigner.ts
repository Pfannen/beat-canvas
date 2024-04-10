import {
	AnnotationSelectionMetadata,
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { getNoteAnnotationKeys } from '..';

// T: The type the selection metadata originates from
// K: A key in T
// selectionMetadataEntry: The metadata for the K
export const getAssignValue = <T, K extends keyof T>(
	selectionMetadataEntry?: SelectionMetadata<T>[K]
) => {
	let assignValue: T[K] | undefined;
	if (selectionMetadataEntry) {
		const { value, allSelectionsHave } = selectionMetadataEntry;
		// If all selections don't have the value, assign them strong
		// OR if all selections do have the value, which is undefined, assign them strong
		if (!allSelectionsHave || !value) assignValue = value;
		// Else assignValue remains undefined
	}

	return assignValue;
};

// TODO: Complete
export const getAnnotationSelectionMetadata = (selections: SelectionData[]) => {
	const metadata: AnnotationSelectionMetadata = {};

	let notesSelected = false;
	selections.forEach(({ note }) => {
		if (!note) return;
		notesSelected = true;

		const { annotations } = note;
		if (!annotations) return;

		for (const key in annotations) {
			const key2 = key as keyof NoteAnnotations;
			const value = annotations[key2];

			if (!metadata[key2]) {
				metadata[key2] = {
					value: value,
					allSelectionsHave: true,
				};
			}
		}
	});
};
