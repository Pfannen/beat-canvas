import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";
import { NoteBeamDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note-beams";

const calculateBeamOffset = (
  beamHeight: number,
  gap: number,
  beamNumber: number
) => {
  const distance = beamHeight + gap;
  return distance * beamNumber;
};

export const beamDrawer: NoteBeamDrawer = ({
  drawCanvas,
  noteDirection,
  beamData,
  endOfStem,
  beamHeight,
  beamGap,
}) => {
  beamData.beams?.forEach((beam) => {
    const { angle, height } = adjustBeamData(
      beamHeight,
      noteDirection,
      beam.angle,
      beam.number
    );
    const y = adjustYValue(
      endOfStem.y,
      noteDirection,
      beamHeight,
      beamGap,
      beam.number
    );
    drawCanvas.drawRectangle({
      corner: { x: endOfStem.x, y },
      height: height,
      width: beam.length,
      drawOptions: { degreeRotation: angle },
    });
  });
};

const adjustYValue = (
  y: number,
  dir: NoteDirection,
  beamHeight: number,
  beamGap: number,
  beamNumber: number
) => {
  const offset = calculateBeamOffset(beamHeight, beamGap, beamNumber);
  return dir === "up" ? y - offset : y + offset;
};

const adjustBeamData = (
  height: number,
  direction: NoteDirection,
  angle: number,
  beamNumber: number
) => {
  angle *= -1;
  if (beamNumber !== 0) {
    angle += 180;
    if (direction === "up") {
      height = -height;
    }
  } else {
    if (direction === "down") {
      height = -height;
    }
  }
  return { height, angle };
};

const adjustStartPos = (
  direction: NoteDirection,
  angle: number,
  start: Coordinate,
  beamNumber: number
) => {};
