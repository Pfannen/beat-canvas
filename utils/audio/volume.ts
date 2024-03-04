import {
	IVolumeNodeModifier,
	IVolumeValueModifer,
	VolumeManagerParams,
	VolumeNode,
	VolumeNodeMap,
} from '@/types/audio/volume';
import { Dynamic } from '@/types/music/note-annotations';
import { Volume } from 'tone';

export class VolumeManager implements IVolumeNodeModifier, IVolumeValueModifer {
	private minDecibels = -30;
	private maxDecibels = 10;
	defaultVolumePct = 0.5;
	defaultDecibels = VolumeManager.getVolumeValue(
		this.defaultVolumePct,
		this.minDecibels,
		this.maxDecibels
	);

	masterVolumeId = 'master';

	private volumeMap: VolumeNodeMap = {};
	private masterVolume = new Volume(this.defaultDecibels).toDestination();

	constructor(volumeParams?: VolumeManagerParams) {
		if (volumeParams) Object.assign(this, volumeParams);
		this.masterVolume.volume.value = this.defaultDecibels;
		this.volumeMap[this.masterVolumeId] = this.masterVolume;
	}

	static getVolumeValue = (
		volumePct: number,
		minDecibels: number,
		maxDecibels: number
	) => {
		if (volumePct === 0) return -Infinity;

		const maxDecibelOffset = minDecibels * -1;

		const max = maxDecibels + maxDecibelOffset;
		const volumeWithOffset = volumePct * max;
		const volume = volumeWithOffset - maxDecibelOffset;

		return volume;
	};

	modifyVolume = (audioId: string, volumePct: number) => {
		if (audioId in this.volumeMap) {
			const volumeValue = VolumeManager.getVolumeValue(
				volumePct,
				this.minDecibels,
				this.maxDecibels
			);
			this.volumeMap[audioId].volume.value = volumeValue;
		}
	};

	mute = (audioId: string) => {
		if (audioId in this.volumeMap) {
			this.volumeMap[audioId];
		}
	};

	addVolumeNode = (audioId: string, volumeNode: VolumeNode) => {
		volumeNode.connect(this.masterVolume);
		volumeNode.volume.value = this.defaultDecibels;
		this.volumeMap[audioId] = volumeNode;
	};

	removeVolumeNode = (audioId: string) => {
		delete this.volumeMap[audioId];
	};
}

// Temporary method, dynamics should affect volume, not velocity
export const dynamicToVelocity = (dynamic: Dynamic) => {
	switch (dynamic) {
		case 'pp':
			return 0.2;
		case 'p':
			return 0.25;
		case 'mp':
			return 0.3;
		case 'mf':
			return 0.4;
		case 'fp':
			return 0.5;
		case 'f':
			return 0.6;
		case 'ff':
			return 0.7;
		default:
			return 0.3;
	}
};
