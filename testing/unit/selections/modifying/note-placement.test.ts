import { curriedPlaceNote } from '../../../../utils/music/modify-score/curried-assigners';
import { Note } from '../../../../components/providers/music/types';
import { NotePlacementValidator } from '../../../../types/modify-score';
import { stacklessNotePlacementValidator } from '../../../../utils/music/note-placement';
import { SelectionData } from '../../../../types/modify-score/assigner';
import { createSelection } from '../../helpers';
import { MeasureAttributes } from '../../../../types/music';

let placementValidator: NotePlacementValidator =
	stacklessNotePlacementValidator;

// #region stackless

// #region 4/4

test('Stackless 4/4: x: 0, quarter', () => {
	const rollingAttributes = {
		timeSignature: {
			beatsPerMeasure: 4,
			beatNote: 4,
		},
	} as MeasureAttributes;
	const measureNotes: Note[] = [];
	const expectedNote1: Note = { x: 0, y: 0, type: 'quarter' };

	const selections: SelectionData[] = [
		createSelection({
			rollingAttributes,
			xStart: expectedNote1.x,
			measureNotes,
			measureIndex: 0,
		}),
	];

	const curriedNotePlacer = curriedPlaceNote('quarter', placementValidator);
	expect(curriedNotePlacer([{ notes: measureNotes }], selections)).toBeTruthy();
	expect(measureNotes).toStrictEqual([expectedNote1]);
});

test('Stackless 4/4: x: 0, 1, eighth', () => {
	const rollingAttributes = {
		timeSignature: {
			beatsPerMeasure: 4,
			beatNote: 4,
		},
	} as MeasureAttributes;
	const measureNotes: Note[] = [];
	const expectedNote1: Note = { x: 0, y: 0, type: 'eighth' };
	const expectedNote2: Note = { x: 1, y: 0, type: 'eighth' };

	const selections: SelectionData[] = [
		createSelection({
			rollingAttributes,
			xStart: expectedNote1.x,
			measureNotes,
			measureIndex: 0,
		}),
		createSelection({
			rollingAttributes,
			xStart: expectedNote2.x,
			measureNotes,
			measureIndex: 0,
		}),
	];

	const curriedNotePlacer = curriedPlaceNote('eighth', placementValidator);
	expect(curriedNotePlacer([{ notes: measureNotes }], selections)).toBeTruthy();
	expect(measureNotes).toStrictEqual([expectedNote1, expectedNote2]);
});

test('Stackless 4/4: x: 0.5, 1, eighth ; x: 0, quarter', () => {
	const rollingAttributes = {
		timeSignature: {
			beatsPerMeasure: 4,
			beatNote: 4,
		},
	} as MeasureAttributes;
	const measureNotes: Note[] = [];
	const expectedNote1: Note = { x: 0.5, y: 0, type: 'eighth' };
	const expectedNote2: Note = { x: 1, y: 0, type: 'eighth' };

	let selections: SelectionData[] = [
		createSelection({
			rollingAttributes,
			xStart: expectedNote1.x,
			measureNotes,
			measureIndex: 0,
		}),
		createSelection({
			rollingAttributes,
			xStart: expectedNote2.x,
			measureNotes,
			measureIndex: 0,
		}),
	];

	let curriedNotePlacer = curriedPlaceNote('eighth', placementValidator);
	expect(curriedNotePlacer([{ notes: measureNotes }], selections)).toBeTruthy();
	expect(measureNotes).toStrictEqual([expectedNote1, expectedNote2]);

	selections = [
		createSelection({
			rollingAttributes,
			xStart: 0,
			measureNotes,
			measureIndex: 0,
		}),
	];
	curriedNotePlacer = curriedPlaceNote('quarter', placementValidator);
	expect(curriedNotePlacer([{ notes: measureNotes }], selections)).toBeFalsy();
	expect(measureNotes).toStrictEqual([expectedNote1, expectedNote2]);
});

// #endregion

// #endregion stackless
