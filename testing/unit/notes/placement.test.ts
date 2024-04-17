import { NotePlacementValidator } from '../../../types/modify-score';
import {
	placeNote,
	stacklessNotePlacementValidator,
} from '../../../utils/music/note-placement';
import { Note } from '../../../components/providers/music/types';

let placementValidator: NotePlacementValidator =
	stacklessNotePlacementValidator;

// #region stackless

// #region 4/4

test('Stackless 4/4: {x: 0, t: quarter}', () => {
	const timeSignature = {
		beatsPerMeasure: 4,
		beatNote: 4,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(notes).toStrictEqual([note1]);
});

test('Stackless 4/4: {x: 0, t: quarter}, {x: 1, t: eighth}', () => {
	const timeSignature = {
		beatsPerMeasure: 4,
		beatNote: 4,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };
	const note2: Note = { x: 1, y: 0, type: 'eighth' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeTruthy();

	expect(notes).toStrictEqual([note1, note2]);
});

test('Stackless 4/4: {x: 0, t: quarter}, {x: 0.5, t: eighth}', () => {
	const timeSignature = {
		beatsPerMeasure: 4,
		beatNote: 4,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };
	const note2: Note = { x: 0.5, y: 0, type: 'eighth' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeFalsy();

	expect(notes).toStrictEqual([note1]);
});

test('Stackless 4/4: {x: 0, t: sixteenth}, {x: 0.25, t: sixteenth}, {x: 0.5, t: sixteenth}, {x: 0.75, t: sixteenth}', () => {
	const timeSignature = {
		beatsPerMeasure: 4,
		beatNote: 4,
	};

	const note1: Note = { x: 0, y: 0, type: 'sixteenth' };
	const note2: Note = { x: 0.25, y: 0, type: 'sixteenth' };
	const note3: Note = { x: 0.5, y: 0, type: 'sixteenth' };
	const note4: Note = { x: 0.75, y: 0, type: 'sixteenth' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note3, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note4, notes, placementValidator, timeSignature)
	).toBeTruthy();

	expect(notes).toStrictEqual([note1, note2, note3, note4]);
});

test('Stackless 4/4: {x: 3, t: half}, {x: 0, t: whole}', () => {
	const timeSignature = {
		beatsPerMeasure: 4,
		beatNote: 4,
	};

	const note1: Note = { x: 3, y: 0, type: 'half' };
	const note2: Note = { x: 0, y: 0, type: 'whole' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeFalsy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeTruthy();

	expect(notes).toStrictEqual([note2]);
});

// #endregion

// #region 3/4

test('Stackless 3/4: {x: 0, t: whole}', () => {
	const timeSignature = {
		beatsPerMeasure: 3,
		beatNote: 4,
	};

	const note1: Note = { x: 0, y: 0, type: 'whole' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeFalsy();

	expect(notes).toStrictEqual([]);
});

// #endregion

// #region 3/8

test('Stackless 3/8: {x: 0, t: quarter}', () => {
	const timeSignature = {
		beatsPerMeasure: 3,
		beatNote: 8,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();

	expect(notes).toStrictEqual([note1]);
});

test('Stackless 3/8: { x: 0, t: quarter }, { x: 2, t: eighth } ', () => {
	const timeSignature = {
		beatsPerMeasure: 3,
		beatNote: 8,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };
	const note2: Note = { x: 2, y: 0, type: 'eighth' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeTruthy();

	expect(notes).toStrictEqual([note1, note2]);
});

test('Stackless 3/8: { x: 0, t: eighth }, { x: 2, t: eighth } ', () => {
	const timeSignature = {
		beatsPerMeasure: 3,
		beatNote: 8,
	};

	const note1: Note = { x: 0, y: 0, type: 'eighth' };
	const note2: Note = { x: 0, y: 0, type: 'eighth' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeFalsy();

	expect(notes).toStrictEqual([note1]);
});

test('Stackless 3/8: { x: 0, t: quarter }, { x: 2, t: quarter } ', () => {
	const timeSignature = {
		beatsPerMeasure: 3,
		beatNote: 8,
	};

	const note1: Note = { x: 0, y: 0, type: 'quarter' };
	const note2: Note = { x: 2, y: 0, type: 'quarter' };

	const notes: Note[] = [];
	expect(
		placeNote(note1, notes, placementValidator, timeSignature)
	).toBeTruthy();
	expect(
		placeNote(note2, notes, placementValidator, timeSignature)
	).toBeFalsy();

	expect(notes).toStrictEqual([note1]);
});

// #endregion

// #endregion
