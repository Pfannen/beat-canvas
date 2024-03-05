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

const testTruthyBeamData = (
  notes: NoteRenderData[],
  beamDataIndicies: Set<number>
) => {
  notes.forEach((note, i) => {
    if (beamDataIndicies.has(i)) {
      expect(note.beamData).toBeTruthy();
    } else expect(!note.beamData).toBeTruthy();
  });
};

//#region attachBeamData - Successful
test("Successful Beaming - 1 division", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 0.5, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);
  testTruthyBeamData(notes, new Set([0]));
});

test("Successful Beaming - 2 separate divisions", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 0.5, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 1, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 2, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 2.5, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);
  testTruthyBeamData(notes, new Set([0, 3]));
});
//#endregion

//#region attachBeamData - No Beaming
test("No Beaming - Rests between each beamable note", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 0.5, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 1, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 1.5, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 2, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);
  testTruthyBeamData(notes, new Set());
});

test("No Beaming - No beamable notes", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
    { x: 1, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
    { x: 2, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
    { x: 3, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 2, measurement);
  testTruthyBeamData(notes, new Set());
});

test("No Beaming - Non beamable and beamable alternation", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
    { x: 1, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
    { x: 1.5, y: 0, type: "quarter", noteDirection: "up", stemOffset: 0 },
    { x: 2.5, y: 0, type: "eighth", noteDirection: "up", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 2, measurement);
  testTruthyBeamData(notes, new Set());
});
//#endregion

//#region attachBeamData - Correct Note Direction
test("Note Direction - Majority up", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 0.25, y: 8, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 0.5, y: 0, type: "sixteenth", noteDirection: "down", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);
  notes.forEach((note) => expect(note.noteDirection).toBe("up"));
});

test("Note Direction - Majority down", () => {
  const notes: NoteRenderData[] = [
    { x: 0, y: 0, type: "sixteenth", noteDirection: "up", stemOffset: 0 },
    { x: 0.25, y: 8, type: "sixteenth", noteDirection: "down", stemOffset: 0 },
    { x: 0.5, y: 8, type: "sixteenth", noteDirection: "down", stemOffset: 0 },
  ];
  attachBeamData(notes, { beatsPerMeasure: 4, beatNote: 4 }, 1, measurement);
  console.log(notes);
  notes.forEach((note) => expect(note.noteDirection).toBe("down"));
});
//#endregion
