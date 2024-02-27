import { ToneInstrument } from '@/types/audio/instrument';
import { InstrumentProps } from '@/types/music/note-annotations';
import * as Tone from 'tone';

export const updateInstrument = (
	instrument: ToneInstrument,
	instrumentProps?: Partial<InstrumentProps>
) => {
	if (!instrumentProps) return;

	const { attack, sustain, decay, release, portamento } = instrumentProps;

	// TODO: Look into envelope and portamento on sampler and poly synth
	const { envelope } = instrument;
	if (attack !== undefined) envelope.attack = attack;
	if (sustain !== undefined) envelope.sustain = sustain;
	if (decay !== undefined) envelope.decay = decay;
	if (release !== undefined) envelope.release = release;
	if (portamento !== undefined) instrument.portamento = portamento;
};

const polySynth = () => new Tone.PolySynth(Tone.Synth).toDestination();

export const getInstrument = (name: string): ToneInstrument => {
	return polySynth();
};
