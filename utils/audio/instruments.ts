import * as Tone from 'tone';

export const polySynth = () => new Tone.PolySynth(Tone.Synth).toDestination();
