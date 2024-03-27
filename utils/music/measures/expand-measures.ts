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
		console.log(`Measures ${forward[0]} - ${forward[1] - 1} repeated`);
		flattenedMeasures.push(...measures.slice(forward[0], forward[1]));
		if (i + 1 in endings) {
			const [beg, end] = endings[i];
			flattenedMeasures.push(...measures.slice(beg, end + 1));
		}
	}
};

export const expandMeasures = (measures: Measure[]) => {
	// If we encounter an ending -> set end always
	// If we encounter a backward repeat -> set end if not set and expand measures

	const expandedMeasures: Measure[] = [];
	let repeatState: RepeatState | undefined;

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		expandedMeasures.push(measure);

		const { staticAttributes } = measure;
		if (staticAttributes) {
			const { repeat, repeatEndings } = staticAttributes;

			if (repeat) {
				if (repeat.forward)
					repeatState = {
						forward: [i, i],
						repeatCount: -1,
						endings: {},
					};
				else if (repeatState) {
					repeatState.repeatCount = repeat.repeatCount;
				}
			}

			if (repeatEndings && repeatState) {
				for (const endingNumber in repeatEndings) {
					repeatState.endings[endingNumber] = [i, repeatEndings[endingNumber]];
				}
			}
		}

		if (repeatState) {
			if (!Object.keys(repeatState.endings).length) repeatState.forward[1]++;

			if (repeatState.repeatCount > 0) {
				applyRepeat(measures, expandedMeasures, repeatState);
				repeatState = undefined;
			}
		}
	}

	return expandedMeasures;
};
