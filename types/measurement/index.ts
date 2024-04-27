import { BeamData } from "../music-rendering/draw-data/note";

export type BeamedNoteInfo = { beams?: BeamData[]; stemOffset: number };

export type BeamableNoteData = {
  x: number;
  y: number;
  noteIndex: number;
  duration: number;
  beamCount: number;
  stemOffset?: number;
};
