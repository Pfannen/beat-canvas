import { TrigHelpers } from "@/utils/trig";
import { BeamNote } from "./note-beam-calculator";
import { Coordinate } from "@/types";

type AddBeamDataDel = (
  angle: number,
  length: number,
  beamNumber: number,
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

  private commitBeams(noteIndex: number, beamCount = this.currentBeams.length) {
    const { x, y } = this.notes[noteIndex];
    for (let i = 0; i < beamCount; i++) {
      let beamLength;
      const startCoordinate = this.currentBeams.pop()!;
      if (startCoordinate.x === x && startCoordinate.y === y) {
        const { x, y } = this.notes[noteIndex - 1];
        beamLength =
          TrigHelpers.calculatePointHypotenuse(
            { x, y },
            startCoordinate,
            this.beamAngle
          ) / 2;
      } else {
        beamLength = TrigHelpers.calculatePointHypotenuse(
          startCoordinate,
          { x, y },
          this.beamAngle
        );
      }

      this.addBeamData(this.beamAngle, beamLength, beamCount - i, noteIndex);
    }
  }

  public getExtraBeams() {
    let currentBeamCount = 0;
    this.notes.forEach((note, i) => {
      const beamCount = note.beamCount - 1;
      const beamDifference = beamCount - currentBeamCount;
      if (beamDifference > 0) {
        this.addBeams(i, beamDifference);
      } else if (beamDifference < 0) {
        this.commitBeams(i - 1, beamDifference * -1);
      }
      currentBeamCount = beamCount;
    });
    this.commitBeams(this.notes.length - 1); //Commit the rest of the beams (if any)
  }
}
