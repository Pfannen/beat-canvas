import {
  DirectionOffsets,
  NoteAnnotationDrawer,
  NoteAnnotationDrawers,
} from "@/types/music-rendering/canvas/beat-canvas";

export const createOffsetsObject = (
  bodyHeight: number,
  bodyWidth: number
): DirectionOffsets => {
  return {
    up: bodyHeight / 2,
    down: bodyHeight / 2,
    left: bodyWidth / 2,
    right: bodyWidth / 2,
  };
};

const drawDotted: NoteAnnotationDrawer = ({
  drawCanvas,
  noteData,
  noteDrawOptions,
  offsets,
}) => {
  const annotationOffset =
    noteDrawOptions.annotationDistanceBodyFraction * noteData.bodyHeight;
  let { x, y } = noteData.bodyCenter;
  if (noteData.noteDirection === "down") {
    x += annotationOffset + offsets.right;
    offsets.right += annotationOffset;
  } else {
    x -= annotationOffset + offsets.left;
    offsets.left += annotationOffset;
  }
  drawCanvas.drawEllipse({
    center: { x, y },
    diameter: noteData.bodyHeight / 3,
    aspectRatio: 1,
  });
};

const drawStaccato: NoteAnnotationDrawer = ({
  drawCanvas,
  noteData,
  noteDrawOptions,
  offsets,
}) => {
  const annotationOffset =
    noteDrawOptions.annotationDistanceBodyFraction * noteData.bodyHeight;
  let { x, y } = noteData.bodyCenter;
  y += annotationOffset + offsets.up;
  offsets.up += annotationOffset;

  drawCanvas.drawEllipse({
    center: { x, y },
    diameter: noteData.bodyHeight / 3,
    aspectRatio: 1,
  });
};

const drawAccent: NoteAnnotationDrawer = ({
  drawCanvas,
  noteData,
  noteDrawOptions,
  offsets,
}) => {
  const bodyWidth = noteData.bodyHeight * noteDrawOptions.noteBodyAspectRatio;
  const sideLength = bodyWidth * 1.1;
  const annotationOffset =
    noteDrawOptions.annotationDistanceBodyFraction * noteData.bodyHeight;
  let { x, y } = noteData.bodyCenter;
  y += annotationOffset + offsets.up;
  offsets.up += annotationOffset;
  x += sideLength / 2;
  const angle = 15;
  drawCanvas.drawRectangle({
    corner: { x, y },
    width: -sideLength,
    height: noteData.bodyHeight * 0.2,
    drawOptions: { degreeRotation: angle },
  });
  drawCanvas.drawRectangle({
    corner: { x, y },
    width: -sideLength,
    height: noteData.bodyHeight * 0.2,
    drawOptions: { degreeRotation: -angle },
  });
};

export const annotationDrawers: Partial<NoteAnnotationDrawers> = {
  dotted: drawDotted,
  staccato: drawStaccato,
  accent: drawAccent,
};
