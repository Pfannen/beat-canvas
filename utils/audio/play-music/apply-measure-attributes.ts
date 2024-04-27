import { ToneInstrument } from '@/types/audio/instrument';
import { MeasureAttributes } from '@/types/music';
import { WedgeDurationInfo } from '@/types/music/measure-traversal';
import { Dynamic } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import {
	dynamicToTargetDynamic,
	dynamicVolumePercentages,
	getDecibelsForDynamic,
	getDynamicVolumePercentage,
	getWedgeTargetDynamic,
} from './dynamics';
import { getValueFromRange } from '@/utils';
import { DecibelRange, WedgeDynamicStore } from '@/types/audio/volume';

export type WedgeApplicationInfo = {
	completedWedge: WedgeDurationInfo;
	startDynamic: Dynamic;
};

export type AttributeApplyingInfo = {
	completedWedge?: WedgeDurationInfo;
	decibelRange: DecibelRange;
	newAttributes?: Partial<MeasureAttributes>;
	curSeconds: number;
};

export const applyWedge = (
	instrument: ToneInstrument,
	transport: Transport,
	wedgeDurInfo: WedgeDurationInfo,
	wedgeDynamicStore: WedgeDynamicStore,
	decibelRange: DecibelRange
) => {
	const { startDynamic } = wedgeDynamicStore;
	const { secondsStart, secondsEnd, crescendo } = wedgeDurInfo;
	const wedgeDuration = secondsEnd - secondsStart;
	const targetDynamic = getWedgeTargetDynamic(startDynamic, crescendo);
	const targetDecibels = getDecibelsForDynamic(decibelRange, targetDynamic);

	transport.schedule(() => {
		instrument.volume.rampTo(targetDecibels, wedgeDuration);
	}, secondsStart);
};

export const applyDynamic = (
	instrument: ToneInstrument,
	transport: Transport,
	seconds: number,
	dynamic: Dynamic,
	decibelRange: DecibelRange
) => {
	const targetDecibels = getDecibelsForDynamic(decibelRange, dynamic);

	transport.schedule(() => {
		instrument.volume.value = targetDecibels;
	}, seconds);
};
