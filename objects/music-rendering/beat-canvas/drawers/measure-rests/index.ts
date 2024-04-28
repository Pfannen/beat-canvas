import {
  RestDrawer,
  RestDrawers,
  SVGRest,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-rests";
import { NoteType } from "@/components/providers/music/types";
import { calculateScaleToHeight } from "@/utils/svg";
import { getRestSVGData } from "@/SVG/measure/rest";

const drawWholeRest: RestDrawer = ({
  drawCanvas,
  restCenter,
  measureComponentHeights,
}) => {
  const width = measureComponentHeights.space * 2;
  const height = measureComponentHeights.space / 2;
  const x = restCenter.x - width / 2;
  const y = restCenter.y + height + measureComponentHeights.line / 2;

  drawCanvas.drawRectangle({ corner: { x, y }, height, width });
};

const drawHalfRest: RestDrawer = ({
  drawCanvas,
  restCenter,
  measureComponentHeights,
}) => {
  const width = measureComponentHeights.space * 2;
  const height = measureComponentHeights.space / 2;
  const x = restCenter.x - width / 2;
  const y = restCenter.y;
  drawCanvas.drawRectangle({ corner: { x, y }, height, width });
};

const drawSVGRest =
  (type: SVGRest): RestDrawer =>
  ({ drawCanvas, restCenter, measureComponentHeights }) => {
    const { paths, viewBox } = getRestSVGData(type);
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
