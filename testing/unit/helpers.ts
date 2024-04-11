import { Note } from '@/components/providers/music/types';
import {
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';
import { NoteAnnotations } from '@/types/music/note-annotations';

export const createNote = (annotations?: NoteAnnotations) => {
	const note: Note = {
		x: 0,
		y: 0,
		type: 'quarter',
		annotations,
	};

	return note;
};

type CreateParams = {
	annotations?: NoteAnnotations;
	rollingAttributes?: MeasureAttributes;
	nonRollingAttributes?: Partial<MeasureAttributes>;
};

export const createSelection = (params: CreateParams = {}) => {
	const { annotations, rollingAttributes, nonRollingAttributes } = params;
	const selection: SelectionData = {
		measureIndex: 0,
		xStart: 0,
		xEnd: 1,
		y: 0,
		// Don't care to populate - not being tested
		rollingAttributes: rollingAttributes || ({} as MeasureAttributes),
		nonRollingAttributes: nonRollingAttributes || {},
	};

	if (annotations) selection.note = createNote(annotations);

	return selection;
};

export const checkMetadata = <T extends {}>(
	metadata: SelectionMetadata<T>,
	check: { [key in keyof T]?: boolean }
) => {
	const keys = Object.keys(check) as (keyof T)[];
	for (const key of keys) {
		if (!metadata[key]) return false;
		else if (metadata[key]!.allSelectionsHave !== check[key]) return false;
	}

	return true;
};
