import { Transport } from 'tone/build/esm/core/clock/Transport';
import { ToneInstrument } from './instrument';
import { ToneAudioBuffer } from 'tone';

export type PlayParams = Partial<{
	getInstrumentNode: (name: string) => ToneInstrument | null;
	onPlay: () => void;
}>;

export type EnqueuedBuffer = {
	name: string;
	buffer: ToneAudioBuffer;
};

export interface IPlaybackButtonProps {
	onClick?: () => void;
}
