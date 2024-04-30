import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";
import { NoteBeamDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/note-beams";
import { SVGData } from "@/types/svg";
import { getSVGHeight, getSVGWidth } from "@/utils/svg";
import { createRotatedRectangleSVG } from "@/utils/svg/path";

export const beamDrawer: NoteBeamDrawer = ({
  drawCanvas,
  noteDirection,
  beamData,
  endOfStem,
  stemWidth,
  beamHeight,
  beamGap,
}) => {
  beamData.beams?.forEach((beam) => {
    const y = adjustYValue(
      endOfStem.y,
      noteDirection,
      beamHeight,
      beamGap,
      beam.number,
      beam.angle
    );
    const startPoint = { x: endOfStem.x, y };
    const beamSVG = createRotatedRectangleSVG(
      startPoint,
      beam.length,
      beamHeight,
      beam.angle
    );
    let adjustedStart = adjustDrawPoint(
      noteDirection,
      stemWidth,
      startPoint,
      beam.angle,
      beamHeight,
      beamData.index
    );
    adjustedStart = adjustDrawPointSVG(
      adjustedStart,
      beam.angle,
      beamSVG,
      beamData.index
    );
    drawCanvas.drawSVG({
      x: adjustedStart.x,
      y: adjustedStart.y,
      paths: beamSVG.paths,
      viewBox: beamSVG.viewBox,
    });
  });
};

const calculateBeamOffset = (
  beamHeight: number,
  gap: number,
  beamNumber: number
) => {
  const distance = beamHeight + gap;
  return distance * beamNumber;
};

const adjustYValue = (
  y: number,
  dir: NoteDirection,
  beamHeight: number,
  beamGap: number,
  beamNumber: number,
  beamAngle: number
) => {
  if (dir === "up") {
    let offset;
    if (beamAngle <= 0) {
      offset = calculateBeamOffset(beamHeight, beamGap * 2, beamNumber); //For whatever reason
    } else {
      offset = calculateBeamOffset(beamHeight, beamGap, beamNumber);
    }
    return y - offset;
  }
  const offset = calculateBeamOffset(beamHeight, beamGap, beamNumber);
  return y + offset;
};

const adjustDrawPoint = (
  noteDirection: NoteDirection,
  stemWidth: number,
  start: Coordinate,
  angle: number,
  beamHeght: number,
  noteIndex: number
) => {
  const tolerenceHeight = beamHeght * 0.95;
  if (noteIndex === 0) {
    if (noteDirection === "up") {
      if (angle > 0) return { x: start.x, y: start.y - tolerenceHeight };
    } else if (noteDirection === "down") {
      let x = (start.x += stemWidth);
      if (angle <= 0) return { x, y: (start.y += tolerenceHeight) };
      return { x, y: start.y };
    }
  }
  return start;
};

const adjustDrawPointSVG = (
  start: Coordinate,
  angle: number,
  svg: SVGData,
  noteIndex: number
) => {
  const svgHeight = getSVGHeight(svg.viewBox);
  if (noteIndex !== 0) {
    const svgWidth = getSVGWidth(svg.viewBox);
    if (angle > 0) {
      return { x: start.x - svgWidth, y: start.y };
    }
    return { x: start.x - svgWidth, y: start.y + svgHeight };
  }
  if (angle > 0) {
    return { x: start.x, y: start.y + svgHeight };
  }
  return start;
};
