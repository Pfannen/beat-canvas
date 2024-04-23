export type BeamData = {
  beamAngle: number;
  beamLength: number;
  noteOffsets: number[];
};

export type BeamableNoteData = {
  x: number;
  y: number;
  duration: number;
  beamCount: number;
  stemOffset?: number;
};
