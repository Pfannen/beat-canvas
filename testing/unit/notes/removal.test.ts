import { Note } from '../../../components/providers/music/types';
import { removeNote } from '../../../utils/music/note-placement';

// #region removal

test('Remove only quarter', () => {
	const note1: Note = { x: 0, y: 0, type: 'quarter' };

	const notes = [note1];
	expect(removeNote(notes, note1.x)).toBeTruthy();
	expect(notes).toStrictEqual([]);
});

test('Remove 2nd eighth', () => {
	const note1: Note = { x: 0, y: 0, type: 'eighth' };
	const note2: Note = { x: 0.5, y: 0, type: 'eighth' };

	const notes = [note1, note2];
	expect(removeNote(notes, note2.x)).toBeTruthy();
	expect(notes).toStrictEqual([note1]);
});

test('Remove 2nd and 4th eighth', () => {
	const note1: Note = { x: 0, y: 0, type: 'eighth' };
	const note2: Note = { x: 0.5, y: 0, type: 'eighth' };
	const note3: Note = { x: 1, y: 0, type: 'eighth' };
	const note4: Note = { x: 1.5, y: 0, type: 'eighth' };
	const note5: Note = { x: 2, y: 0, type: 'eighth' };

	const notes = [note1, note2, note3, note4, note5];
	expect(removeNote(notes, note2.x)).toBeTruthy();
	expect(removeNote(notes, note4.x)).toBeTruthy();
	expect(notes).toStrictEqual([note1, note3, note5]);
});

test('Remove 2nd, 3rd, 6th, and 8th eighth in random order', () => {
	const note1: Note = { x: 0, y: 0, type: 'eighth' };
	const note2: Note = { x: 0.5, y: 0, type: 'eighth' };
	const note3: Note = { x: 1, y: 0, type: 'eighth' };
	const note4: Note = { x: 1.5, y: 0, type: 'eighth' };
	const note5: Note = { x: 2, y: 0, type: 'eighth' };
	const note6: Note = { x: 2.5, y: 0, type: 'eighth' };
	const note7: Note = { x: 3, y: 0, type: 'eighth' };
	const note8: Note = { x: 3.5, y: 0, type: 'eighth' };

	const notes = [note1, note2, note3, note4, note5, note6, note7, note8];
	expect(removeNote(notes, note8.x)).toBeTruthy();
	expect(removeNote(notes, note3.x)).toBeTruthy();
	expect(removeNote(notes, note6.x)).toBeTruthy();
	expect(removeNote(notes, note2.x)).toBeTruthy();
	expect(notes).toStrictEqual([note1, note4, note5, note7]);
});

test('Remove note from empty notes', () => {
	const notes: Note[] = [];
	expect(removeNote(notes, 0)).toBeFalsy();
	expect(notes).toStrictEqual([]);
});

// #endregion
