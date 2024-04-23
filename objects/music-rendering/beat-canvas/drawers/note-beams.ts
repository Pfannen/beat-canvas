import { NoteDirection } from "@/lib/notes/types";
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
    let drawHeight = beamHeight;
    if (beam.number === 0 || beamData.index === 0) {
      drawHeight = getAdjustedBeamHeight(beamHeight, noteDirection);
    }
    const offset = calculateBeamOffset(beamHeight, beamGap, beam.number);
    const y =
      noteDirection === "up" ? endOfStem.y - offset : endOfStem.y + offset;
    const angle = beamData.index !== 0 ? -beam.angle + 180 : -beam.angle;
    drawCanvas.drawRectangle({
      corner: { x: endOfStem.x, y },
      height: drawHeight,
      width: beam.length,
      drawOptions: { degreeRotation: angle },
    });
  });
};

const getAdjustedBeamHeight = (height: number, direction: NoteDirection) => {
  if (direction === "up") {
    return height;
  }
  return -height;
};
