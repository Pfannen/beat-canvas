import {
  RestDrawer,
  RestDrawers,
  SVGRest,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-rests";
import { NoteType } from "@/components/providers/music/types";
import { calculateScaleToHeight, getSVGAspectRatio } from "@/utils/svg";
import { getRestSVGData } from "@/SVG/measure/rest";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { Coordinate } from "@/types";

const drawWholeRest: RestDrawer = ({
  drawCanvas,
  restCenter,
  measureComponentHeights,
  isDotted,
}) => {
  const width = measureComponentHeights.space * 2;
  const height = measureComponentHeights.space / 2;
  const x = restCenter.x - width / 2;
  const y = restCenter.y + height + measureComponentHeights.line / 2;

  drawCanvas.drawRectangle({ corner: { x, y }, height, width });
  if (isDotted) {
    drawDot(drawCanvas, restCenter, width, measureComponentHeights.space);
  }
};

const drawHalfRest: RestDrawer = ({
  drawCanvas,
  restCenter,
  measureComponentHeights,
  isDotted,
}) => {
  const width = measureComponentHeights.space * 2;
  const height = measureComponentHeights.space / 2;
  const x = restCenter.x - width / 2;
  const y = restCenter.y;
  drawCanvas.drawRectangle({ corner: { x, y }, height, width });
  if (isDotted) {
    drawDot(drawCanvas, restCenter, width, measureComponentHeights.space);
  }
};

const drawSVGRest =
  (type: SVGRest): RestDrawer =>
  ({ drawCanvas, restCenter, measureComponentHeights, isDotted }) => {
    const { paths, viewBox } = getRestSVGData(type, isDotted);
    const height = calculateScaleToHeight(
      viewBox,
      measureComponentHeights.space * 3
    );

    drawCanvas.drawSVG({
      x: restCenter.x,
      y: restCenter.y,
      paths,
      viewBox,
      center: true,
      scale: height,
    });
    if (isDotted) {
      const aspectRatio = getSVGAspectRatio(viewBox);
      const width = aspectRatio * height;
      drawDot(drawCanvas, restCenter, width, measureComponentHeights.space);
    }
  };

const drawDot = (
  drawCanvas: IDrawingCanvas,
  center: Coordinate,
  restWidth: number,
  spaceHeight: number
) => {
  drawCanvas.drawEllipse({
    center: { x: center.x - (restWidth + spaceHeight), y: center.y },
    diameter: spaceHeight / 2,
    aspectRatio: 1,
  });
};

export const restDrawers: Partial<RestDrawers> = {
  whole: drawWholeRest,
  half: drawHalfRest,
  quarter: drawSVGRest("quarter"),
  eighth: drawSVGRest("eighth"),
  sixteenth: drawSVGRest("sixteenth"),
  thirtysecond: drawSVGRest("thirtysecond"),
};

export const getRestDrawer = (type: NoteType) => {
  return restDrawers[type];
};
