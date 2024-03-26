import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, RepeatEndings } from '@/types/music';

type RepeatState = {
	forward: [number, number];
	endings: {
		[ending in number]: [number, number];
	};
	repeatCount: number;
};

/* export const getNonTemporalAttributes = (
	measure: Measure,
	beatsPerMeasure: number
) => {
	const { attributes } = measure;
	if (!attributes || attributes.length === 0) return {};

	const last = attributes[attributes.length - 1];
	if (last.x !== beatsPerMeasure) return {};

	const nonTemporalAttributes: Partial<MeasureAttributes> = {};
	const { attributes: lastAttr } = last;
	if (lastAttr.repeat) nonTemporalAttributes.repeat = lastAttr.repeat;
	if (lastAttr.repeatEndings)
		nonTemporalAttributes.repeatEndings = lastAttr.repeatEndings;
	return nonTemporalAttributes;
};
 */
const applyRepeat = (
	measures: Measure[],
	flattenedMeasures: Measure[],
	repeatState: RepeatState
) => {
	if (repeatState.repeatCount === -1) return;
	const { forward, endings, repeatCount } = repeatState;
	for (let i = 1; i <= repeatCount; i++) {
		flattenedMeasures.push(...measures.slice(forward[0], forward[1]));
		if (i + 1 in endings) {
			const [beg, end] = endings[i];
			flattenedMeasures.push(...measures.slice(beg, end + 1));
		}
	}

	repeatState.forward = [-1, -1];
	repeatState.endings = {};
	repeatState.repeatCount = -1;
};

const updateRepeatState = (
	measure: Measure,
	measureNumber: number,
	repeatState: RepeatState
) => {
	if (
		repeatState.forward[0] !== -1 &&
		Object.keys(repeatState.endings).length === 0
	)
		repeatState.forward[1]++;

	if (!measure.staticAttributes) return;

	const { staticAttributes } = measure;

	if (staticAttributes.repeat && staticAttributes.repeat.forward) {
		repeatState.forward = [measureNumber, measureNumber];
		repeatState.endings = {};
		repeatState.repeatCount = -1;
	}

	const { repeat, repeatEndings } = staticAttributes;

	if (repeat && !repeat.forward) {
		repeatState.repeatCount = repeat.repeatCount;
	}

	if (repeatEndings) {
		for (const endingNumber in repeatEndings) {
			repeatState.endings[endingNumber] = [
				measureNumber,
				repeatEndings[endingNumber],
			];
		}
	}
};

export const flattenMeasures = (measures: Measure[]) => {
	const flattenedMeasures: Measure[] = [];

	let repeatState: RepeatState = {
		forward: [-1, -1],
		endings: {},
		repeatCount: -1,
	};

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		flattenedMeasures.push(measure);
		updateRepeatState(measure, i, repeatState);
		applyRepeat(measures, flattenedMeasures, repeatState);
	}

	return flattenedMeasures;
};
