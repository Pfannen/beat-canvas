export type Coordinate<T = number> = { x: T; y: T };

export type BeamData = {
  beamAngle: number;
  beamLength: number;
  noteOffsets: number[];
};
