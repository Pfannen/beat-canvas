import { Param, Player, ToneAudioNode, Volume } from 'tone';
import { ToneInstrument } from './instrument';

export type VolumeNode = Volume | Player | ToneInstrument;

export interface IVolumeValueModifer {
	modifyVolume: (audioId: string, volumePct: number) => void;
}

export interface IVolumeNodeModifier {
	addVolumeNode: (audioId: string, volumeNode: VolumeNode) => void;
	removeVolumeNode: (audioId: string) => void;
}

export type VolumeNodeMap = {
	[key in string]: VolumeNode;
};

export type VolumeManagerParams = {
	minDecibels?: number;
	maxDecibels?: number;
	defaultVolumePct?: number;
};

export type VolumePairs = {
	audioId: string;
	volumePercentage: number;
}[];
