import { modifyNoteAnnotation } from '../../../utils/music/modify-score/note';
import { Note } from '../../../components/providers/music/types';
import { NoteAnnotations } from '../../../types/music/note-annotations';
import assert, { equal } from 'assert';

const createNote = (annotations?: NoteAnnotations) => {
	const note: Note = {
		x: 0,
		y: 0,
		type: 'quarter',
		annotations,
	};

	return note;
};

// #region Add

test('Add - staccato', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'staccato', true);

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.staccato, true);
});

test('Add - slur', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'slur', 'start');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.slur, 'start');
});

test('Add - accent', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'accent', 'weak');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.accent, 'weak');
});

test('Add - dynamic', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'dynamic', 'p');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.dynamic, 'p');
});

test('Add - accidental', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'accidental', 'flat');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.accidental, 'flat');
});

test('Add - chord', () => {
	const note = createNote();
	modifyNoteAnnotation(note, 'chord', true);

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.chord, true);
});

// #endregion Add

// #region Update

test('Update - staccato', () => {
	const note = createNote({ staccato: true });
	modifyNoteAnnotation(note, 'staccato', false);

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.staccato, false);
});

test('Update - slur', () => {
	const note = createNote({ slur: 'start' });
	modifyNoteAnnotation(note, 'slur', 'stop');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.slur, 'stop');
});

test('Update - accent', () => {
	const note = createNote({ accent: 'weak' });
	modifyNoteAnnotation(note, 'accent', 'strong');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.accent, 'strong');
});

test('Update - dynamic', () => {
	const note = createNote({ dynamic: 'p' });
	modifyNoteAnnotation(note, 'dynamic', 'mf');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.dynamic, 'mf');
});

test('Update - accidental', () => {
	const note = createNote({ accidental: 'flat' });
	modifyNoteAnnotation(note, 'accidental', 'sharp');

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.accidental, 'sharp');
});

test('Update - chord', () => {
	const note = createNote({ chord: true });
	modifyNoteAnnotation(note, 'chord', true);

	assert(note.annotations !== undefined);

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.chord, true);
});

// #endregion Update

// #region Delete

test('Delete - staccato', () => {
	const note = createNote({ staccato: true });
	modifyNoteAnnotation(note, 'staccato');

	assert(note.annotations === undefined);
});

test('Delete - slur', () => {
	const note = createNote({ slur: 'start' });
	modifyNoteAnnotation(note, 'slur');

	assert(note.annotations === undefined);
});

test('Delete - accent', () => {
	const note = createNote({ accent: 'weak' });
	modifyNoteAnnotation(note, 'accent');

	assert(note.annotations === undefined);
});

test('Delete - dynamic', () => {
	const note = createNote({ dynamic: 'mf' });
	modifyNoteAnnotation(note, 'dynamic');

	assert(note.annotations === undefined);
});

test('Delete - accidental', () => {
	const note = createNote({ accidental: 'flat' });
	modifyNoteAnnotation(note, 'accidental');

	assert(note.annotations === undefined);
});

test('Delete - chord', () => {
	const note = createNote({ chord: true });
	modifyNoteAnnotation(note, 'chord');

	assert(note.annotations === undefined);
});

// #endregion Delete

// #region Delete w/ other attributes

test('Delete w/ other attributes 2ct', () => {
	const note = createNote({ staccato: true, dynamic: 'p' });
	modifyNoteAnnotation(note, 'staccato');

	assert(note.annotations !== undefined);
	expect(note.annotations.staccato).toBeUndefined;

	equal(Object.keys(note.annotations).length, 1);
	equal(note.annotations.dynamic, 'p');
});

test('Delete w/ other attributes 4ct', () => {
	const note = createNote({
		staccato: true,
		dynamic: 'p',
		chord: true,
		accent: 'weak',
	});

	modifyNoteAnnotation(note, 'staccato');
	assert(note.annotations !== undefined);
	expect(note.annotations.staccato).toBeUndefined;
	equal(Object.keys(note.annotations).length, 3);

	modifyNoteAnnotation(note, 'chord');
	assert(note.annotations !== undefined);
	expect(note.annotations.chord).toBeUndefined;
	equal(Object.keys(note.annotations).length, 2);

	modifyNoteAnnotation(note, 'dynamic');
	modifyNoteAnnotation(note, 'accent');
	assert(note.annotations === undefined);
});

// #endregion Delete w/ other attributes
