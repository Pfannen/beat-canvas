import { Measure, Note } from "../../../components/providers/music/types";
import { SegmentData } from "../../../components/ui/measure/types";
import { measuresToSegmentArray } from "../../../utils/segments/measuresToSegments";
import { minimalSegmentGenerator } from "../../../utils/segments/segment-gen-1";

const sameNote = (note1: Note, note2: Note) => {
  return (
    note1.type === note2.type && note1.x === note2.x && note1.y === note2.y
  );
};

const sameNotes = (notes1?: Note[], notes2?: Note[]) => {
  const notesLen1 = notes1 ? notes1.length : -1;
  const notesLen2 = notes2 ? notes2.length : -1;

  if (notesLen1 !== notesLen2) return false;

  if (notesLen1 <= 0) return true;

  for (let j = 0; j < notesLen1; j++) {
    const note1 = notes1![j];
    const note2 = notes1![j];

    if (!sameNote(note1, note2)) return false;
  }

  return true;
};

const sameSegment = (segment1: SegmentData, segment2: SegmentData) => {
  return (
    segment1.xPos === segment2.xPos &&
    segment1.beatPercentage === segment2.beatPercentage &&
    sameNotes(segment1.notes, segment2.notes)
  );
};

const segmentsEqual = (segments1: SegmentData[], segments2: SegmentData[]) => {
  if (segments1.length !== segments2.length) return false;

  for (let i = 0; i < segments1.length; i++) {
    const segment1 = segments1[i];
    const segment2 = segments2[i];

    if (!sameSegment(segment1, segment2)) return false;
  }

  return true;
};

const segmentGenerator = minimalSegmentGenerator;

//#region no notes

test("No measures given", () => {
  const measures: Measure[] = [];

  const expectedSegments: SegmentData[] = [];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("One empty measure", () => {
  const measures: Measure[] = [{ notes: [] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("Two empty measures", () => {
  const measures: Measure[] = [{ notes: [] }, { notes: [] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
    { xPos: 4, beatPercentage: 1 },
    { xPos: 5, beatPercentage: 1 },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region quarter notes

test("One measure with a quarter note on xPos 0", () => {
  const measures: Measure[] = [{ notes: [{ x: 0, y: 0, type: "quarter" }] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1, notes: [{ x: 0, y: 0, type: "quarter" }] },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("One measure with two quarter notes on xPos 0 and xPos 1.5", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "quarter" },
        { x: 1.5, y: 0, type: "quarter" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1, notes: [{ x: 0, y: 0, type: "quarter" }] },
    { xPos: 1, beatPercentage: 0.5 },
    {
      xPos: 1.5,
      beatPercentage: 1,
      notes: [{ x: 1.5, y: 0, type: "quarter" }],
    },
    { xPos: 2.5, beatPercentage: 0.5 },
    { xPos: 3, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("Two measures with two quarter notes on xPos 3 and xPos 4", () => {
  const measures: Measure[] = [
    {
      notes: [{ x: 3, y: 0, type: "quarter" }],
    },
    {
      notes: [{ x: 4, y: 0, type: "quarter" }],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1, notes: [{ x: 3, y: 0, type: "quarter" }] },
    { xPos: 4, beatPercentage: 1, notes: [{ x: 4, y: 0, type: "quarter" }] },
    { xPos: 5, beatPercentage: 1 },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("6/8 time with quarter notes on xPos 0 and 2", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "quarter" },
        { x: 2, y: 0, type: "quarter" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 2, notes: [{ x: 0, y: 0, type: "quarter" }] },
    { xPos: 2, beatPercentage: 2, notes: [{ x: 2, y: 0, type: "quarter" }] },
    { xPos: 4, beatPercentage: 1 },
    { xPos: 5, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    6,
    8
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("5/4 time with quarter notes on xPos 2.5, 4, and 5", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 2.5, y: 0, type: "quarter" },
        { x: 4, y: 0, type: "quarter" },
      ],
    },
    {
      notes: [{ x: 5, y: 0, type: "quarter" }],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 0.5 },
    {
      xPos: 2.5,
      beatPercentage: 1,
      notes: [{ x: 2.5, y: 0, type: "quarter" }],
    },
    { xPos: 3.5, beatPercentage: 0.5 },
    { xPos: 4, beatPercentage: 1, notes: [{ x: 4, y: 0, type: "quarter" }] },
    { xPos: 5, beatPercentage: 1, notes: [{ x: 5, y: 0, type: "quarter" }] },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
    { xPos: 8, beatPercentage: 1 },
    { xPos: 9, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    5,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("One empty measure starting on beat 12", () => {
  const measures: Measure[] = [{ notes: [] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 12, beatPercentage: 1 },
    { xPos: 13, beatPercentage: 1 },
    { xPos: 14, beatPercentage: 1 },
    { xPos: 15, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    12,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region eighth notes

test("One eighth note on xPos 0", () => {
  const measures: Measure[] = [{ notes: [{ x: 0, y: 0, type: "eighth" }] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 0.5, notes: [{ x: 0, y: 0, type: "eighth" }] },
    { xPos: 0.5, beatPercentage: 0.5 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("Eighth notes on xPos 0.5, 2.5, and 3.5", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0.5, y: 0, type: "eighth" },
        { x: 2.5, y: 0, type: "eighth" },
        { x: 3.5, y: 0, type: "eighth" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 0.5 },
    {
      xPos: 0.5,
      beatPercentage: 0.5,
      notes: [{ x: 0.5, y: 0, type: "eighth" }],
    },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 0.5 },
    {
      xPos: 2.5,
      beatPercentage: 0.5,
      notes: [{ x: 2.5, y: 0, type: "eighth" }],
    },
    { xPos: 3, beatPercentage: 0.5 },
    {
      xPos: 3.5,
      beatPercentage: 0.5,
      notes: [{ x: 3.5, y: 0, type: "eighth" }],
    },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("2/4 time with eighth notes on xPos 1, 1.5, and 2 ", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 1, y: 0, type: "eighth" },
        { x: 1.5, y: 0, type: "eighth" },
      ],
    },
    {
      notes: [{ x: 2, y: 0, type: "eighth" }],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 0.5, notes: [{ x: 1, y: 0, type: "eighth" }] },
    {
      xPos: 1.5,
      beatPercentage: 0.5,
      notes: [{ x: 1.5, y: 0, type: "eighth" }],
    },
    { xPos: 2, beatPercentage: 0.5, notes: [{ x: 2, y: 0, type: "eighth" }] },
    { xPos: 2.5, beatPercentage: 0.5 },
    { xPos: 3, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    2,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("9/8 time with eighth note on xPos 0", () => {
  const measures: Measure[] = [{ notes: [{ x: 0, y: 0, type: "eighth" }] }];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1, notes: [{ x: 0, y: 0, type: "eighth" }] },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
    { xPos: 4, beatPercentage: 1 },
    { xPos: 5, beatPercentage: 1 },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
    { xPos: 8, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    9,
    8
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region sixteenth notes

test("One sixteenth note on xPos 0", () => {
  const measures: Measure[] = [{ notes: [{ x: 0, y: 0, type: "sixteenth" }] }];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 0.25,
      notes: [{ x: 0, y: 0, type: "sixteenth" }],
    },
    { xPos: 0.25, beatPercentage: 0.25 },
    { xPos: 0.5, beatPercentage: 0.5 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("Sixteenth notes on xPos 3.5 and 3.75", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 3.5, y: 0, type: "sixteenth" },
        { x: 3.75, y: 0, type: "sixteenth" },
      ],
    },
    {
      notes: [],
    },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 0.5 },
    {
      xPos: 3.5,
      beatPercentage: 0.25,
      notes: [{ x: 3.5, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 3.75,
      beatPercentage: 0.25,
      notes: [{ x: 3.75, y: 0, type: "sixteenth" }],
    },
    { xPos: 4, beatPercentage: 1 },
    { xPos: 5, beatPercentage: 1 },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("2/4 time with sixteenth notes on xPos 0, 0.25, and 0.75", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "sixteenth" },
        { x: 0.25, y: 0, type: "sixteenth" },
        { x: 0.75, y: 0, type: "sixteenth" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 0.25,
      notes: [{ x: 0, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 0.25,
      beatPercentage: 0.25,
      notes: [{ x: 0.25, y: 0, type: "sixteenth" }],
    },
    { xPos: 0.5, beatPercentage: 0.25 },
    {
      xPos: 0.75,
      beatPercentage: 0.25,
      notes: [{ x: 0.75, y: 0, type: "sixteenth" }],
    },
    { xPos: 1, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    2,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("5/16 time with sixteenth notes on xPos 0, 1, 3, and 4", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "sixteenth" },
        { x: 1, y: 0, type: "sixteenth" },
        { x: 3, y: 0, type: "sixteenth" },
        { x: 4, y: 0, type: "sixteenth" },
      ],
    },
    {
      notes: [],
    },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 1,
      notes: [{ x: 0, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 1,
      beatPercentage: 1,
      notes: [{ x: 1, y: 0, type: "sixteenth" }],
    },
    { xPos: 2, beatPercentage: 1 },
    {
      xPos: 3,
      beatPercentage: 1,
      notes: [{ x: 3, y: 0, type: "sixteenth" }],
    },
    { xPos: 4, beatPercentage: 1, notes: [{ x: 4, y: 0, type: "sixteenth" }] },
    { xPos: 5, beatPercentage: 1 },
    { xPos: 6, beatPercentage: 1 },
    { xPos: 7, beatPercentage: 1 },
    { xPos: 8, beatPercentage: 1 },
    { xPos: 9, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    5,
    16
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region 32nd notes

test("One measure with a 32nd note on xPos 0", () => {
  const measures: Measure[] = [
    { notes: [{ x: 0, y: 0, type: "thirtysecond" }] },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 0.125,
      notes: [{ x: 0, y: 0, type: "thirtysecond" }],
    },
    { xPos: 0.125, beatPercentage: 0.125 },
    { xPos: 0.25, beatPercentage: 0.25 },
    { xPos: 0.5, beatPercentage: 0.5 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 1 },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("One measure with a 32nd note on xPos 3.875", () => {
  const measures: Measure[] = [
    { notes: [{ x: 3.875, y: 0, type: "thirtysecond" }] },
  ];

  const expectedSegments: SegmentData[] = [
    { xPos: 0, beatPercentage: 1 },
    { xPos: 1, beatPercentage: 1 },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 0.5 },
    { xPos: 3.5, beatPercentage: 0.25 },
    { xPos: 3.75, beatPercentage: 0.125 },
    {
      xPos: 3.875,
      beatPercentage: 0.125,
      notes: [{ x: 3.875, y: 0, type: "thirtysecond" }],
    },
  ];
  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );
  console.log(resultingSegments);

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion

//#region mixture of notes

test("Quarter note on xPos 0, two eighth notes on xPos 1 and 1.5, four sixteenth notes on 2, 2.25, 2.5, and 2.75", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "quarter" },
        { x: 1, y: 0, type: "eighth" },
        { x: 1.5, y: 0, type: "eighth" },
        { x: 2, y: 0, type: "sixteenth" },
        { x: 2.25, y: 0, type: "sixteenth" },
        { x: 2.5, y: 0, type: "sixteenth" },
        { x: 2.75, y: 0, type: "sixteenth" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 1,
      notes: [{ x: 0, y: 0, type: "quarter" }],
    },
    { xPos: 1, beatPercentage: 0.5, notes: [{ x: 1, y: 0, type: "eighth" }] },
    {
      xPos: 1.5,
      beatPercentage: 0.5,
      notes: [{ x: 1.5, y: 0, type: "eighth" }],
    },
    {
      xPos: 2,
      beatPercentage: 0.25,
      notes: [{ x: 2, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 2.25,
      beatPercentage: 0.25,
      notes: [{ x: 2.25, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 2.5,
      beatPercentage: 0.25,
      notes: [{ x: 2.5, y: 0, type: "sixteenth" }],
    },
    {
      xPos: 2.75,
      beatPercentage: 0.25,
      notes: [{ x: 2.75, y: 0, type: "sixteenth" }],
    },
    { xPos: 3, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("Half note on xPos 0, eighth note on xPos 3.5 and 4, and quarter note on xPos 5.5", () => {
  const measures: Measure[] = [
    {
      notes: [
        { x: 0, y: 0, type: "half" },
        { x: 3.5, y: 0, type: "eighth" },
        { x: 4, y: 0, type: "eighth" },
        { x: 5.5, y: 0, type: "quarter" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 2,
      notes: [{ x: 0, y: 0, type: "half" }],
    },
    { xPos: 2, beatPercentage: 1 },
    { xPos: 3, beatPercentage: 0.5 },
    {
      xPos: 3.5,
      beatPercentage: 0.5,
      notes: [{ x: 3.5, y: 0, type: "eighth" }],
    },
    { xPos: 4, beatPercentage: 0.5, notes: [{ x: 4, y: 0, type: "eighth" }] },
    { xPos: 4.5, beatPercentage: 0.5 },
    { xPos: 5, beatPercentage: 0.5 },
    {
      xPos: 5.5,
      beatPercentage: 1,
      notes: [{ x: 5.5, y: 0, type: "quarter" }],
    },
    { xPos: 6.5, beatPercentage: 0.5 },
    { xPos: 7, beatPercentage: 1 },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    4,
    4
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

test("8/8 time with whole half notes on xPos 0, 8, and 12", () => {
  const measures: Measure[] = [
    {
      notes: [{ x: 0, y: 0, type: "half" }],
    },
    {
      notes: [
        { x: 8, y: 0, type: "half" },
        { x: 12, y: 0, type: "half" },
      ],
    },
  ];

  const expectedSegments: SegmentData[] = [
    {
      xPos: 0,
      beatPercentage: 4,
      notes: [{ x: 0, y: 0, type: "half" }],
    },
    {
      xPos: 4,
      beatPercentage: 1,
    },
    {
      xPos: 5,
      beatPercentage: 1,
    },
    {
      xPos: 6,
      beatPercentage: 1,
    },
    {
      xPos: 7,
      beatPercentage: 1,
    },
    {
      xPos: 8,
      beatPercentage: 4,
      notes: [{ x: 8, y: 0, type: "half" }],
    },
    {
      xPos: 12,
      beatPercentage: 4,
      notes: [{ x: 12, y: 0, type: "half" }],
    },
  ];

  const resultingSegments = measuresToSegmentArray(
    segmentGenerator,
    measures,
    0,
    8,
    8
  );

  expect(segmentsEqual(expectedSegments, resultingSegments)).toBeTruthy();
});

//#endregion
