import {
	SelectionData,
	SelectionMetadata,
} from '../../../../types/modify-score/assigner/metadata';
import { Note } from '../../../../components/providers/music/types';
import { NoteAnnotations } from '../../../../types/music/note-annotations';
import { MeasureAttributes } from '../../../../types/music';
import assert, { equal } from 'assert';
import { getAnnotationSelectionMetadata } from '../../../../utils/music/modify-score/metadata-helpers/annotations';
import { getNoteAnnotationKeys } from '../../../../utils/music';
import { checkMetadata, createSelection } from '../../helpers';

test('Metadata is returned with every annotation mapping to a value', () => {
	const a: NoteAnnotations = {
		accent: 'strong',
	};
	const selections: SelectionData[] = [createSelection({ annotations: a })];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(Object.keys(metadata).length, getNoteAnnotationKeys().length);
});

test('All notes have the same 1 annotation', () => {
	const a: NoteAnnotations = {
		accent: 'strong',
	};
	const selections: SelectionData[] = [
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { accent: true }), true);
});

test('All notes have the same 2 annotations', () => {
	const a: NoteAnnotations = {
		accent: 'strong',
		dotted: true,
	};
	const selections: SelectionData[] = [
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { accent: true, dotted: true }), true);
});

test('All notes have same annotations not applied', () => {
	const a: NoteAnnotations = {
		accent: 'strong',
		dotted: true,
	};
	const selections: SelectionData[] = [
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
		createSelection({ annotations: a }),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { slur: true, accidental: true }), true);
});

test('All notes have different annotations', () => {
	const selections: SelectionData[] = [
		createSelection({ annotations: { accent: 'weak' } }),
		createSelection({ annotations: { dotted: true } }),
		createSelection({ annotations: { accidental: 'flat' } }),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(
		checkMetadata(metadata, {
			accent: false,
			dotted: false,
			accidental: false,
		}),
		true
	);
});

test('Not all selections are notes, but all notes have same 1 annotation', () => {
	const a: NoteAnnotations = {
		accent: 'strong',
	};
	const selections: SelectionData[] = [
		createSelection({ annotations: a }),
		createSelection(),
		createSelection({ annotations: a }),
		createSelection(),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { accent: true }), true);
});

test('No selections are notes', () => {
	const selections: SelectionData[] = [
		createSelection(),
		createSelection(),
		createSelection(),
		createSelection(),
	];

	const metadata = getAnnotationSelectionMetadata(selections);

	assert(!metadata);
});
