import { ToneInstrument } from './instrument';

export abstract class ScoreVolumeModifier {
	static modifyVolume: (audioId: string, volumePct: number) => void;
}

export type ToneInstrumentMap = {
	[key in string]: ToneInstrument;
};