import {
	DecibelRange,
	IVolumeNodeModifier,
	IVolumeValueModifer,
	VolumeIdToPercentageMap,
	VolumeManagerParams,
	VolumeNode,
	VolumeNodeMap,
	VolumePair,
} from '@/types/audio/volume';
import { Dynamic } from '@/types/music/note-annotations';
import { Volume } from 'tone';
import {
	deepyCopy,
	getPercentageFromRange,
	getValueFromRange,
	isOnClient,
} from '..';

export const createVolumePair = (audioId: string, volumePercentage: number) => {
	return {
		audioId,
		volumePercentage,
	} as VolumePair;
};

export class VolumeManager implements IVolumeNodeModifier, IVolumeValueModifer {
	// Min max decibels set in the constructor
	private decibelRange: DecibelRange;
	defaultVolumePct = 0.5;

	masterVolumeId = 'Master Volume';

	private volumeMap: VolumeNodeMap = {};
	private masterVolume?: Volume;

	constructor(volumeParams?: VolumeManagerParams) {
		this.decibelRange = getApplicationDecibelRange();

		if (volumeParams) Object.assign(this, volumeParams);

		if (isOnClient()) {
			this.masterVolume = new Volume().toDestination();
			this.masterVolume.volume.value = this.getVolumeValue(1);
			this.volumeMap[this.masterVolumeId] = this.masterVolume;
		}
	}

	getVolumeValue = (volumePct: number) => {
		const { min, max } = this.decibelRange;
		return volumePct < 0.01
			? -Infinity
			: getValueFromRange(min, max, volumePct);
	};

	decibelsToPercentage = (decibels: number) => {
		const { min, max } = this.decibelRange;
		return getPercentageFromRange(min, max, decibels);
	};

	modifyVolume = (audioId: string, volumePct: number) => {
		if (audioId in this.volumeMap) {
			const volumeValue = this.getVolumeValue(volumePct);
			this.volumeMap[audioId].volume.value = volumeValue;
		}
	};

	mute = (audioId: string) => {
		if (audioId in this.volumeMap) {
			this.volumeMap[audioId];
		}
	};

	addVolumeNode = (audioId: string, volumeNode: VolumeNode) => {
		if (this.masterVolume) volumeNode.connect(this.masterVolume);
		volumeNode.volume.value = this.getVolumeValue(this.defaultVolumePct);
		this.volumeMap[audioId] = volumeNode;
	};

	getVolumeNode = (audioId: string) => this.volumeMap[audioId];

	removeVolumeNode = (audioId: string) => {
		if (audioId === this.masterVolumeId) return;
		delete this.volumeMap[audioId];
	};

	getVolumePairs = () => {
		const volumePairs: VolumePair[] = Object.keys(this.volumeMap).map((key) => {
			const node = this.volumeMap[key];
			const volumePercentage = this.decibelsToPercentage(node.volume.value);
			console.log({ volumePercentage });
			return createVolumePair(key, volumePercentage);
		});

		return volumePairs;
	};

	getVolumeIdToPercentageMap = () => {
		const volumePairsMap: VolumeIdToPercentageMap = {};
		Object.keys(this.volumeMap).forEach((key) => {
			const node = this.volumeMap[key];
			const volumePercentage = this.decibelsToPercentage(node.volume.value);
			volumePairsMap[key] = volumePercentage;
		});

		return volumePairsMap;
	};
}

// Play around with these ranges
const APPLICATION_DECIBEL_RANGE: DecibelRange = {
	min: -20,
	max: 0,
};

const ENQUEUE_DECIBEL_RANGE: DecibelRange = {
	min: 0,
	max: 20,
};

export const getApplicationDecibelRange = () =>
	deepyCopy(APPLICATION_DECIBEL_RANGE);

export const getEnqueueDecibelRange = () => deepyCopy(ENQUEUE_DECIBEL_RANGE);
