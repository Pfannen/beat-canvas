import { modifyMeasureAttribute } from '../../../utils/music/modify-score/measures';
import { Measure } from '../../../components/providers/music/types';
import assert, { deepStrictEqual, equal } from 'assert';

const createMeasures = (count: number) => {
	const measures: Measure[] = [];
	for (let i = 0; i < count; i++) {
		measures.push({ notes: [] });
	}

	return measures;
};

// #region Add

test('Add - key signature', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'keySignature', 0);

	assert(measures[0].staticAttributes !== undefined);

	equal(Object.keys(measures[0].staticAttributes).length, 1);
	deepStrictEqual(measures[0].staticAttributes.keySignature, 0);
});

test('Add - clef', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'clef', 'bass');

	assert(measures[0].staticAttributes !== undefined);

	equal(Object.keys(measures[0].staticAttributes).length, 1);
	deepStrictEqual(measures[0].staticAttributes.clef, 'bass');
});

test('Add - repeat', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'repeat', { forward: true });

	assert(measures[0].staticAttributes !== undefined);

	equal(Object.keys(measures[0].staticAttributes).length, 1);
	deepStrictEqual(measures[0].staticAttributes.repeat, { forward: true });
});

test('Add - repeat endings', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'repeatEndings', { 1: 1 });

	assert(measures[0].staticAttributes !== undefined);

	equal(Object.keys(measures[0].staticAttributes).length, 1);
	deepStrictEqual(measures[0].staticAttributes.repeatEndings, { 1: 1 });
});

test('Add - metronome', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'metronome', {
		beatNote: 4,
		beatsPerMinute: 100,
	});

	assert(measures[0].staticAttributes === undefined);
	assert(measures[0].temporalAttributes !== undefined);

	equal(measures[0].temporalAttributes.length, 1);
	deepStrictEqual(measures[0].temporalAttributes[0], {
		x: 0,
		attributes: {
			metronome: {
				beatNote: 4,
				beatsPerMinute: 100,
			},
		},
	});
});

test('Add - dynamic', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(1, measures, 0, 'dynamic', 'p');

	assert(measures[0].staticAttributes === undefined);
	assert(measures[0].temporalAttributes !== undefined);

	equal(measures[0].temporalAttributes.length, 1);
	deepStrictEqual(measures[0].temporalAttributes[0], {
		x: 1,
		attributes: {
			dynamic: 'p',
		},
	});
});

test('Add - wedge', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(3, measures, 0, 'wedge', {
		crescendo: true,
		xEnd: 4,
		measureEnd: 1,
	});

	assert(measures[0].staticAttributes === undefined);
	assert(measures[0].temporalAttributes !== undefined);

	equal(measures[0].temporalAttributes.length, 1);
	deepStrictEqual(measures[0].temporalAttributes[0], {
		x: 3,
		attributes: {
			wedge: {
				crescendo: true,
				xEnd: 4,
				measureEnd: 1,
			},
		},
	});
});

// #endregion Add

// #region Delete

test('Delete - key signature', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'keySignature', 0);
	modifyMeasureAttribute(0, measures, 0, 'keySignature');

	assert(measures[0].staticAttributes === undefined);
});

test('Delete - dynamic 1ct', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'dynamic', 'p');
	modifyMeasureAttribute(0, measures, 0, 'dynamic');

	assert(measures[0].temporalAttributes === undefined);
});

test('Delete - dynamic 2ct', () => {
	const measures = createMeasures(1);
	modifyMeasureAttribute(0, measures, 0, 'dynamic', 'p');
	modifyMeasureAttribute(3, measures, 0, 'dynamic', 'pp');

	assert(measures[0].temporalAttributes !== undefined);
	equal(measures[0].temporalAttributes.length, 2);

	modifyMeasureAttribute(0, measures, 0, 'dynamic');
	assert(measures[0].temporalAttributes !== undefined);
	equal(measures[0].temporalAttributes.length, 1);

	modifyMeasureAttribute(0, measures, 0, 'dynamic');
	assert(measures[0].temporalAttributes !== undefined);
	equal(measures[0].temporalAttributes.length, 1);

	modifyMeasureAttribute(3, measures, 0, 'dynamic');
	assert(measures[0].temporalAttributes === undefined);
});

// #endregion Delete
