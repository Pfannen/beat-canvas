import { Note, NoteDisplayData } from "@/components/providers/music/types";
import { Music } from "@/objects/music/readonly-music";
import {
  AttachBeamDataContext,
  attachBeamData,
} from "@/objects/music/music-display-data/note-display-data-attacher/attachments/beam-attachment";
import { NoteDisplayDataAttcher } from "@/objects/music/music-display-data/note-display-data-attacher";
import { Measurements } from "@/objects/measurement/measurements";
import { BODY_CT } from "@/objects/measurement/constants";

const aboveBelowCount = 5;

const testTruthyBeamData = (
  notes: NoteDisplayData[],
  beamDataIndicies: Set<number>
) => {
  notes.forEach((note, i) => {
    if (beamDataIndicies.has(i)) {
      expect(note.beamData).toBeTruthy();
    } else expect(!note.beamData).toBeTruthy();
  });
};

const getNoteDisplayData = (notes: Note[]) => {
  const music = new Music();
  music.setMeasures([{ notes }]);
  const displayData = NoteDisplayDataAttcher.initialize(music);
  const noteDisplayData = displayData[0];
  const beamDataContext: AttachBeamDataContext = {
    measurements: new Measurements(aboveBelowCount, BODY_CT, 3),
    getMeasureDimensions: (_) => ({ height: 1, width: 1 }),
  };
  attachBeamData(beamDataContext)({ music, noteDisplayData, measureIndex: 0 });
  return noteDisplayData;
};

//#region attachBeamData - Successful
test("Successful Beaming - 1 division", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "eighth" },
    { x: 0.5, y: 0, type: "eighth" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  testTruthyBeamData(noteDisplayData, new Set([0]));
});

test("Successful Beaming - 2 separate divisions", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "eighth" },
    { x: 0.5, y: 0, type: "eighth" },
    { x: 1, y: 0, type: "eighth" },
    { x: 2, y: 0, type: "eighth" },
    { x: 2.5, y: 0, type: "eighth" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  testTruthyBeamData(noteDisplayData, new Set([0, 3]));
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
  const noteDisplayData = getNoteDisplayData(notes);
  testTruthyBeamData(noteDisplayData, new Set());
});

test("No Beaming - No beamable notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "quarter" },
    { x: 1, y: 0, type: "quarter" },
    { x: 2, y: 0, type: "quarter" },
    { x: 3, y: 0, type: "quarter" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  testTruthyBeamData(noteDisplayData, new Set());
});

test("No Beaming - Non beamable and beamable alternation", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "quarter" },
    { x: 1, y: 0, type: "eighth" },
    { x: 1.5, y: 0, type: "quarter" },
    { x: 2.5, y: 0, type: "eighth" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  testTruthyBeamData(noteDisplayData, new Set());
});
//#endregion

//#region attachBeamData - Correct Note Direction
test("Note Direction - Majority up", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.25, y: 8, type: "sixteenth" },
    { x: 0.5, y: 0, type: "sixteenth" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  noteDisplayData.forEach((note) => expect(note.noteDirection).toBe("up"));
});

test("Note Direction - Majority down", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.25, y: 8, type: "sixteenth" },
    { x: 0.5, y: 8, type: "sixteenth" },
  ];
  const noteDisplayData = getNoteDisplayData(notes);
  noteDisplayData.forEach((note) => expect(note.noteDirection).toBe("down"));
});
//#endregion
