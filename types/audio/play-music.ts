import { ToneInstrument } from './instrument';

export type PlayParams = Partial<{
	getInstrumentNode: (name: string) => ToneInstrument | null;
	onPlay: () => void;
}>;
