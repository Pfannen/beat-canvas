import Measurement from "../../../objects/measurement";
import { attachBeamData } from "../../../objects/music/measure-iterator/modifiers/beam-modifier";
import { NoteRenderData } from "../../../components/providers/music/types";

const componentsBelowBody = 5;
const segmentFraction = 0.25;
const height = 1;

const measurement = new Measurement(
  componentsBelowBody,
  segmentFraction,
  height
);

test("Eighth note beam", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 0.5, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);

  expect(notes[0].beamData).toBeTruthy();
});
