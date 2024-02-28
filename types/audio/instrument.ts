import { Instrument } from 'tone/build/esm/instrument/Instrument';
import { PolySynthOptions, SamplerOptions, Synth, SynthOptions } from 'tone';

export type ToneInstrument =
	| Instrument<SynthOptions>
	| Instrument<PolySynthOptions<Synth>>
	| Instrument<SamplerOptions>;

export type ToneInstrumentSpecifier = {
	id: string;
	instrument: ToneInstrument;
};
