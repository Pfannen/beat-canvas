import { Measure } from '@/components/providers/music/types';
import { DurationAttributeKey } from './measure-traversal';

export type DurationLocationInfo = {
	measureStartIdx: number;
	measureEndIdx: number;
	durItemStartIdx: number;
	durItemEndIdx: number;
};

export type DurationAttributeRemover = (
	measures: Measure[],
	durLocInfo: DurationLocationInfo
) => void;

export type DurationAttributeRemoverMap = {
	[key in DurationAttributeKey]: DurationAttributeRemover;
};
