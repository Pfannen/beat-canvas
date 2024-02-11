import { SegmentCount } from '../../components/ui/measure/types';
import { segmentGen1 } from '../../utils/segments/segment-gen-1';

const segmentsEqual = (
	segments1: SegmentCount[],
	segments2: SegmentCount[]
) => {
	if (segments1.length !== segments2.length) return false;

	for (let i = 0; i < segments1.length; i++) {
		const segment1 = segments1[i];
		const segment2 = segments2[i];

		if (
			segment1.count !== segment2.count ||
			segment1.segmentBeat !== segment2.segmentBeat
		)
			return false;
	}

	return true;
};

//#region quarter note

test('xPos 0 - 1 ; identitical to removing a quarter note placed on a downbeat', () => {
	const expectedSegments: SegmentCount[] = [{ segmentBeat: 1, count: 1 }];
	const resultingSegments = segmentGen1(0, 1);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.5 - 1.5 ; identitical to removing a quarter note placed on an upbeat', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
	];
	const resultingSegments = segmentGen1(0.5, 1.5);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.75 - 1.75 ; identitical to removing a quarter note placed on the last sixteenth note portion', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0.75, 1.75);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region eigth note

test('xPos 0 - 0.5 ; identitical to removing an eighth note placed on a downbeat', () => {
	const expectedSegments: SegmentCount[] = [{ segmentBeat: 0.5, count: 1 }];
	const resultingSegments = segmentGen1(0, 0.5);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.5 - 1 ; identitical to removing an eighth note placed on an upbeat', () => {
	const expectedSegments: SegmentCount[] = [{ segmentBeat: 0.5, count: 1 }];
	const resultingSegments = segmentGen1(0.5, 1);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.25 - 0.75 ; identitical to removing an eighth note placed on the second sixteenth note portion', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0.25, 0.75);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.75 - 1.25 ; identitical to removing an eighth note placed on the last sixteenth note portion', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0.75, 1.25);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 18.75 - 19.25 ; just like the last test, but using different starting and ending positions', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(18.75, 19.25);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region dotted eighth note

test('xPos 0 - 0.75 ; identitical to removing a dotted eighth note on a downbeat', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0, 0.75);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.5 - 1.25 ; identitical to removing a dotted eighth note placed on an upbeat', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0.5, 1.25);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.25 - 1 ; identitical to removing a dotted eighth note placed on the second sixteenth note portion', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
	];
	const resultingSegments = segmentGen1(0.25, 1);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region half note

test('xPos 0 - 2 ; identitical to removing a half note placed on a downbeat', () => {
	const expectedSegments: SegmentCount[] = [{ segmentBeat: 1, count: 2 }];
	const resultingSegments = segmentGen1(0, 2);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.5 - 2.5 ; identitical to removing a half note placed on an upbeat', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 1, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
	];
	const resultingSegments = segmentGen1(0.5, 2.5);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0.75 - 2.75 ; identitical to removing a half note placed on the last sixteenth note portion', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 1, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(0.75, 2.75);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region less trivial segmenting

test('xPos 2.75 - 5.25 ; less trivial segmenting', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 1, count: 2 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(2.75, 5.25);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 1.125 - 7.75 ; less trivial segmenting', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 0.125, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 1, count: 5 },
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
	];
	const resultingSegments = segmentGen1(1.125, 7.75);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test('xPos 0 - 3.875 ; less trivial segmenting', () => {
	const expectedSegments: SegmentCount[] = [
		{ segmentBeat: 1, count: 3 },
		{ segmentBeat: 0.5, count: 1 },
		{ segmentBeat: 0.25, count: 1 },
		{ segmentBeat: 0.125, count: 1 },
	];
	const resultingSegments = segmentGen1(0, 3.875);
	expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region invalid parameters

test('invalid parameters ; xPos1 equals xPos2', () => {
	expect(segmentGen1(1000, 1000).length === 0).toBeTruthy();
});

test('invalid parameters ; xPos1 is greater than xPos2', () => {
	expect(segmentGen1(0.5, 0).length === 0).toBeTruthy();
});

//#endregion
