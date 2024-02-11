import {
	Measure,
	Note,
	SegmentBeat,
} from '../../components/providers/music/types';
import { getNoteDuration } from '../../components/providers/music/utils';
import {
	SegmentCount,
	SegmentData,
	SegmentGenerator,
} from '../../components/ui/measure/types';

type SegmentConstructor<T> = (
	segmentCounts: SegmentCount[],
	currentSegments: T,
	xPosStart: number
) => T;

export const constructSegments: SegmentConstructor<SegmentData[]> = (
	segmentCounts: SegmentCount[],
	currentSegments: SegmentData[],
	xPosStart: number
) => {
	let xPos = xPosStart;
	for (const { segmentBeat, count } of segmentCounts) {
		for (let i = 0; i < count; i++) {
			currentSegments.push({ beatPercentage: segmentBeat, xPos });
			xPos += segmentBeat;
		}
	}

	return currentSegments;
};

export const measuresToSegmentArray = (
	segmentGenerator: SegmentGenerator,
	measures: Measure[],
	measureStart: number,
	beatsPerMeasure = 4,
	beatNote = 4
) => {
	if (!measures.length) return [];

	const segments: SegmentData[] = [];
	let xPos1 = measureStart;

	for (const { notes } of measures) {
		const xPos2 = getXPos2(xPos1, notes, 0, beatsPerMeasure);

		const prependSegments = segmentGenerator(xPos1, xPos2);
		constructSegments(prependSegments, segments, xPos1);
		xPos1 = xPos2;

		for (let i = 0; i < notes.length; i++) {
			const { x, y, type } = notes[i];

			const beatPercentage = getNoteDuration(type, beatNote);
			segments.push({
				notes: [{ x, y, type }],
				beatPercentage,
				xPos: xPos1,
			});

			xPos1 += beatPercentage;

			// If we did not end on the first beat of the next measure
			if (xPos1 % beatsPerMeasure !== 0) {
				const xPos2 = getXPos2(xPos1, notes, i + 1, beatsPerMeasure);
				const appendSegments = segmentGenerator(xPos1, xPos2);
				constructSegments(appendSegments, segments, xPos1);

				xPos1 = xPos2;
			}
		}
	}

	return segments;
};

const getXPos2 = (
	xPos1: number,
	notes: Note[],
	noteIdx: number,
	beatsPerMeasure: number
) => {
	if (noteIdx >= notes.length)
		return getRemainingMeasureLength(xPos1, beatsPerMeasure) + xPos1;
	else return notes[noteIdx].x;
};

const getRemainingMeasureLength = (xPos: number, beatsPerMeasure: number) => {
	const beatNumber = Math.floor(xPos) % beatsPerMeasure;
	const beatOffset = xPos - Math.floor(xPos);
	const normalizedXPos = beatNumber + beatOffset;
	const remainingDistance = beatsPerMeasure - normalizedXPos;
	return remainingDistance;
};

/* export const measuresToSegments = <T>(
	segmentGenerator: SegmentGenerator,
	segmentConstructor: SegmentConstructor<T>,
	measures: Measure[],
	measureStart: number,
    beatsPerMeasure = 4
) => {
	
};
*/
