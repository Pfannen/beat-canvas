import { Player, ToneAudioBuffer, Volume } from 'tone';
import { ToneInstrument } from './instrument';
import { Dynamic } from '../music/note-annotations';

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

export type VolumePair = {
	audioId: string;
	volumePercentage: number;
};

export type VolumeIdToPercentageMap = {
	[audioId in string]: number;
};

export type VolumePairMap<T extends string = string> = {
	[key in T]: VolumePair[];
};

export type MusicVolumePairMap = VolumePairMap<'master' | 'imported' | 'score'>;

export type ToneBufferVolumePair = {
	buffer: ToneAudioBuffer;
	volumePercentage: number;
};

export type AudioBufferVolumePair = {
	buffer: AudioBuffer;
	volumePercentage: number;
};

export type DecibelRange = {
	min: number;
	max: number;
};

export type WedgeDynamicStore = {
	startDynamic: Dynamic;
};
