import { Coordinate } from "../types";
import { BeamNote } from "./note-beam-calculator";

type AddBeamDataDel = (
  angle: number,
  length: number,
  noteIndex: number
) => void;

export class BeamGenerator {
  private notes: BeamNote[];
  private beamAngle: number;
  private addBeamData: AddBeamDataDel;
  private currentBeams: Coordinate[] = [];
  constructor(
    notes: BeamNote[],
    beamAngle: number,
    addBeamData: AddBeamDataDel
  ) {
    this.notes = notes;
    this.beamAngle = beamAngle;
    this.addBeamData = addBeamData;
  }

  private addBeams(noteIndex: number, beamCount: number) {
    for (let i = 0; i < beamCount; i++) {
      this.currentBeams.push(this.notes[noteIndex]);
    }
  }

  private commitBeams(noteIndex: number, beamCount: number) {}

  public getExtraBeams() {}
}
