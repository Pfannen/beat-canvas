import { Note } from "@/components/providers/music/types";
import { Music } from "@/objects/music/readonly-music";
import {
  MusicIterator,
  MusicIteratorCallback,
} from "@/objects/music/music-display-data/music-iterator";
import { getGenericMeasurementObj } from "@/testing/utils/music";
import { NoteDisplayDataAttcher } from "@/objects/music/music-display-data/note-display-data-attacher";

const getArgs = (notes: Note[]) => {
  const music = new Music();
  music.setMeasures([{ notes }]);
  return { music, measurement: getGenericMeasurementObj() };
};

const runIteratorTest = (
  notes: Note[],
  testCallback: MusicIteratorCallback
) => {
  const { music } = getArgs(notes);
  const noteDisplayData = NoteDisplayDataAttcher.initialize(music);
  MusicIterator.iterate(music.measures!, noteDisplayData, music, testCallback);
};

type TestData = { componentType: string; type?: string } | undefined;

const createTestMapping = (truths: TestData[]) => {
  const mapping: { [index: number]: TestData } = {};
  truths.forEach((val, i) => {
    mapping[i] = val;
  });
  return mapping;
};

const runMeasureTest = (notes: Note[], truths: TestData[]) => {
  const { music, measurement } = getArgs(notes);
  const truthMap = createTestMapping(truths);
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(truths.length);
    measure.components.forEach((component, i) => {
      const truth = truthMap[i];
      if (truth) {
        expect(component.type).toBe(truth.componentType);
        if (truth.type) {
          if (component.type === "note") {
            expect(component.note.type).toBe(truth.type);
          } else {
            expect(component.rest.type).toBe(truth.type);
          }
        }
      }
    });
  };
  const noteDisplayData = NoteDisplayDataAttcher.initialize(music);
  MusicIterator.iterate(music.measures!, noteDisplayData, music, callback);
};

//#region Full Measures
test("Full Measure - Whole Note", () => {
  const notes: Note[] = [{ x: 0, y: 0, type: "whole" }];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});

test("Full Measure - Half Notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "half" },
    { x: 2, y: 0, type: "half" },
  ];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});

test("Full Measure - Quarter Notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "quarter" },
    { x: 1, y: 0, type: "quarter" },
    { x: 2, y: 0, type: "quarter" },
    { x: 3, y: 0, type: "quarter" },
  ];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});

test("Full Measure - Eighth Notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "eighth" },
    { x: 0.5, y: 0, type: "eighth" },
    { x: 1, y: 0, type: "eighth" },
    { x: 1.5, y: 0, type: "eighth" },
    { x: 2, y: 0, type: "eighth" },
    { x: 2.5, y: 0, type: "eighth" },
    { x: 3, y: 0, type: "eighth" },
    { x: 3.5, y: 0, type: "eighth" },
  ];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});

test("Full Measure - Sixteenth Notes", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "sixteenth" },
    { x: 0.25, y: 0, type: "sixteenth" },
    { x: 0.5, y: 0, type: "sixteenth" },
    { x: 0.75, y: 0, type: "sixteenth" },
    { x: 1, y: 0, type: "sixteenth" },
    { x: 1.25, y: 0, type: "sixteenth" },
    { x: 1.5, y: 0, type: "sixteenth" },
    { x: 1.75, y: 0, type: "sixteenth" },
    { x: 2, y: 0, type: "sixteenth" },
    { x: 2.25, y: 0, type: "sixteenth" },
    { x: 2.5, y: 0, type: "sixteenth" },
    { x: 2.75, y: 0, type: "sixteenth" },
    { x: 3, y: 0, type: "sixteenth" },
    { x: 3.25, y: 0, type: "sixteenth" },
    { x: 3.5, y: 0, type: "sixteenth" },
    { x: 3.75, y: 0, type: "sixteenth" },
  ];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});

test("Full Measure - Dotted Eighths w/Sixteenths", () => {
  const notes: Note[] = [
    { x: 0, y: 0, type: "dotted-eighth" },
    { x: 0.75, y: 0, type: "sixteenth" },
    { x: 1, y: 0, type: "sixteenth" },
    { x: 1.25, y: 0, type: "dotted-eighth" },
    { x: 2, y: 0, type: "dotted-eighth" },
    { x: 2.75, y: 0, type: "dotted-eighth" },
    { x: 3.5, y: 0, type: "sixteenth" },
    { x: 3.75, y: 0, type: "sixteenth" },
  ];
  const callback: MusicIteratorCallback = (measure) => {
    measure.components.forEach(({ type }) => {
      expect(type).toBe("note");
    });
  };
  runIteratorTest(notes, callback);
});
//#endregion

//#region Partial Measures (Empty Beginning)
test("Partial Measure - Empty", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(1);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("whole");
  };
  runIteratorTest([], callback);
});

test("Partial Measure - Empty first three beats", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    let component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("half");
    component = measure.components[1];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("quarter");
  };
  runIteratorTest([{ x: 3, y: 1, type: "quarter" }], callback);
});

test("Partial Measure - Empty first two beats", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(2);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("half");
  };
  runIteratorTest([{ x: 2, y: 1, type: "half" }], callback);
});

test("Partial Measure - Empty first beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(2);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("quarter");
  };
  runIteratorTest([{ x: 1, y: 1, type: "dotted-half" }], callback);
});

test("Partial Measure - Empty dotted-eighth beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest")
      expect(component.rest.type).toBe("dotted-eighth");
  };
  runIteratorTest(
    [
      { x: 0.75, y: 1, type: "dotted-half" },
      { x: 3.75, y: 1, type: "sixteenth" },
    ],
    callback
  );
});

test("Partial Measure - Empty eighth-beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("eighth");
  };
  runIteratorTest(
    [
      { x: 0.5, y: 1, type: "dotted-half" },
      { x: 3.5, y: 1, type: "eighth" },
    ],
    callback
  );
});

test("Partial Measure - Empty sixteenth-beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(4);
    const component = measure.components[0];
    expect(component.type).toBe("rest");
    if (component.type === "rest")
      expect(component.rest.type).toBe("sixteenth");
  };
  runIteratorTest(
    [
      { x: 0.25, y: 1, type: "dotted-half" },
      { x: 3.25, y: 1, type: "eighth" },
      { x: 3.75, y: 1, type: "sixteenth" },
    ],
    callback
  );
});
//#endregion

//#region Partial Measures (Empty End)
test("Partial Measure - Empty last three beats", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    let component = measure.components[2];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("half");
    component = measure.components[1];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("quarter");
  };
  runIteratorTest([{ x: 0, y: 1, type: "quarter" }], callback);
});

test("Partial Measure - Empty last two beats", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(2);
    const component = measure.components[1];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("half");
  };
  runIteratorTest([{ x: 0, y: 1, type: "half" }], callback);
});

test("Partial Measure - Empty last beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(2);
    const component = measure.components[1];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("quarter");
  };
  runIteratorTest([{ x: 0, y: 1, type: "dotted-half" }], callback);
});

test("Partial Measure - Empty last dotted-eighth beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    const component = measure.components[2];
    expect(component.type).toBe("rest");
    if (component.type === "rest")
      expect(component.rest.type).toBe("dotted-eighth");
  };
  runIteratorTest(
    [
      { x: 0, y: 1, type: "dotted-half" },
      { x: 3, y: 1, type: "sixteenth" },
    ],
    callback
  );
});

test("Partial Measure - Empty last eighth-beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(3);
    const component = measure.components[2];
    expect(component.type).toBe("rest");
    if (component.type === "rest") expect(component.rest.type).toBe("eighth");
  };
  runIteratorTest(
    [
      { x: 0, y: 1, type: "dotted-half" },
      { x: 3, y: 1, type: "eighth" },
    ],
    callback
  );
});

test("Partial Measure - Empty last sixteenth-beat", () => {
  const callback: MusicIteratorCallback = (measure) => {
    expect(measure.components.length).toBe(4);
    const component = measure.components[3];
    expect(component.type).toBe("rest");
    if (component.type === "rest")
      expect(component.rest.type).toBe("sixteenth");
  };
  runIteratorTest(
    [
      { x: 0, y: 1, type: "dotted-half" },
      { x: 3, y: 1, type: "eighth" },
      { x: 3.5, y: 1, type: "sixteenth" },
    ],
    callback
  );
});
//#endregion

//#region Every Other Measures
test("Every Other Measure - Dotted-quarter notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "dotted-quarter" },
    { x: 3, y: 1, type: "quarter" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "eighth" },
    { componentType: "rest", type: "quarter" },
    { componentType: "note" },
  ]);
});

test("Every Other Measure - Quarter notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "quarter" },
    { x: 2, y: 1, type: "quarter" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "quarter" },
    { componentType: "note" },
    { componentType: "rest", type: "quarter" },
  ]);
});

test("Every Other Measure - Dotted-eighth notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "dotted-eighth" },
    { x: 1.5, y: 1, type: "dotted-eighth" },
    { x: 3, y: 1, type: "dotted-eighth" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "rest", type: "eighth" },
    { componentType: "note" },
    { componentType: "rest", type: "dotted-eighth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
  ]);
});

test("Every Other Measure - Eighth notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "eighth" },
    { x: 1, y: 1, type: "eighth" },
    { x: 2, y: 1, type: "eighth" },
    { x: 3, y: 1, type: "eighth" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "eighth" },
    { componentType: "note" },
    { componentType: "rest", type: "eighth" },
    { componentType: "note" },
    { componentType: "rest", type: "eighth" },
    { componentType: "note" },
    { componentType: "rest", type: "eighth" },
  ]);
});

test("Every Other Measure - Dotted-sixteenth notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "dotted-sixteenth" },
    { x: 0.75, y: 1, type: "dotted-sixteenth" },
    { x: 1.5, y: 1, type: "dotted-sixteenth" },
    { x: 2.25, y: 1, type: "dotted-sixteenth" },
    { x: 3, y: 1, type: "dotted-sixteenth" },
    { x: 3.75, y: 1, type: "sixteenth" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "dotted-sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "dotted-sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "thirtysecond" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "dotted-sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "dotted-sixteenth" },
    { componentType: "note" },
  ]);
});

test("Every Other Measure - Sixteenth notes", () => {
  const notes: Note[] = [
    { x: 0, y: 1, type: "sixteenth" },
    { x: 0.5, y: 1, type: "sixteenth" },
    { x: 1, y: 1, type: "sixteenth" },
    { x: 1.5, y: 1, type: "sixteenth" },
    { x: 2, y: 1, type: "sixteenth" },
    { x: 2.5, y: 1, type: "sixteenth" },
    { x: 3, y: 1, type: "sixteenth" },
    { x: 3.5, y: 1, type: "sixteenth" },
  ];
  runMeasureTest(notes, [
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
    { componentType: "note" },
    { componentType: "rest", type: "sixteenth" },
  ]);
});
//#endregion
