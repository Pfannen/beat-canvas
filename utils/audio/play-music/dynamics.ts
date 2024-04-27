import { DecibelRange } from '@/types/audio/volume';
import { Dynamic } from '@/types/music/note-annotations';
import { getValueFromRange } from '@/utils';

export const dynamicVolumePercentages: { [key in Dynamic]: number } = {
	ppp: 0.11,
	pp: 0.22,
	p: 0.33,
	mp: 0.44,
	mf: 0.55,
	fp: 0.66,
	f: 0.77,
	ff: 0.88,
	fff: 0.99,
};

export const getDynamicVolumePercentage = (dynamic: Dynamic) => {
	return dynamicVolumePercentages[dynamic] || dynamicVolumePercentages['mp'];
};

export const dynamicToTargetDynamic: {
	[key in Dynamic]: { crescendo: Dynamic; decrescendo: Dynamic };
} = {
	ppp: { crescendo: 'p', decrescendo: 'ppp' },
	pp: { crescendo: 'mp', decrescendo: 'ppp' },
	p: { crescendo: 'mp', decrescendo: 'pp' },
	mp: { crescendo: 'fp', decrescendo: 'pp' },
	mf: { crescendo: 'f', decrescendo: 'p' },
	fp: { crescendo: 'ff', decrescendo: 'mp' },
	f: { crescendo: 'ff', decrescendo: 'mf' },
	ff: { crescendo: 'fff', decrescendo: 'mf' },
	fff: { crescendo: 'fff', decrescendo: 'f' },
};

export const getWedgeTargetDynamic = (
	currentDynamic: Dynamic,
	crescendo: boolean
) => {
	const dynamicTarget = dynamicToTargetDynamic[currentDynamic];
	// Safe guard in the event a random string is passed as a dynamic
	if (dynamicTarget) {
		return crescendo ? dynamicTarget.crescendo : dynamicTarget.decrescendo;
	} else return 'mp';
};

export const getDecibelsForDynamic = (
	decibelRange: DecibelRange,
	dynamic: Dynamic
) => {
	const targetPercentage = getDynamicVolumePercentage(dynamic);
	const { min, max } = decibelRange;
	const targetDecibels = getValueFromRange(min, max, targetPercentage);

	return targetDecibels;
};
