import { Note, NoteRenderData } from "@/components/providers/music/types";
import Measurement from "@/objects/measurement";
import { Music } from "@/objects/music/measure-data-container";
import { initializeMeasureRenderData } from "@/objects/music/music-display-data";
import { attachBeamData } from "@/objects/music/music-display-data/modifiers/beam-modifier";

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

const getAttachmentArgs = (notes: Note[]) => {
  const music = new Music();
  music.setMeasures([{ notes }]);
  const renderData = initializeMeasureRenderData(music, measurement, 0);
  return { music, renderData, measureIndex: 0 };
};

//#region attachBeamData - Successful
test("Successful Beaming - 1 division", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "eighth" },
    { x: 0.5, y: 0, type: "eighth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  testTruthyBeamData(renderData, new Set([0]));
});

test("Successful Beaming - 2 separate divisions", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "eighth" },
    { x: 0.5, y: 0, type: "eighth" },
    { x: 1, y: 0, type: "eighth" },
    { x: 2, y: 0, type: "eighth" },
    { x: 2.5, y: 0, type: "eighth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  testTruthyBeamData(renderData, new Set([0, 3]));
});
//#endregion

//#region attachBeamData - No Beaming
test("No Beaming - Rests between each beamable note", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.5, y: 0, type: "sixteenth" },
    { x: 1, y: 0, type: "sixteenth" },
    { x: 1.5, y: 0, type: "sixteenth" },
    { x: 2, y: 0, type: "sixteenth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  testTruthyBeamData(renderData, new Set());
});

test("No Beaming - No beamable notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "quarter" },
    { x: 1, y: 0, type: "quarter" },
    { x: 2, y: 0, type: "quarter" },
    { x: 3, y: 0, type: "quarter" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  testTruthyBeamData(renderData, new Set());
});

test("No Beaming - Non beamable and beamable alternation", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "quarter" },
    { x: 1, y: 0, type: "eighth" },
    { x: 1.5, y: 0, type: "quarter" },
    { x: 2.5, y: 0, type: "eighth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  testTruthyBeamData(renderData, new Set());
});
//#endregion

//#region attachBeamData - Correct Note Direction
test("Note Direction - Majority up", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.25, y: 8, type: "sixteenth" },
    { x: 0.5, y: 0, type: "sixteenth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);

  attachBeamData(music, renderData, measureIndex, measurement);
  renderData.forEach((note) => expect(note.noteDirection).toBe("up"));
});

test("Note Direction - Majority down", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.25, y: 8, type: "sixteenth" },
    { x: 0.5, y: 8, type: "sixteenth" },
  ];
  const { music, renderData, measureIndex } = getAttachmentArgs(notes);
  attachBeamData(music, renderData, measureIndex, measurement);
  renderData.forEach((note) => expect(note.noteDirection).toBe("down"));
});
//#endregion
