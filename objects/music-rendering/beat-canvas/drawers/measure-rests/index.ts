import {
  RestDrawer,
  RestDrawers,
  SVGRest,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-rests";
import { getRestSVGData } from "./rest-svgs";
import { NoteType } from "@/components/providers/music/types";
import { calculateScaleToHeight } from "@/utils/svg";

// export class RestDrawer {
//   private drawMap: Partial<RestDrawers>;
//   private drawCanvas: IDrawingCanvas;
//   constructor(drawCanvas: IDrawingCanvas) {
//     this.drawCanvas = drawCanvas;
//     this.drawMap = {
//       whole: this.drawWholeRest,
//       half: this.drawHalfRest,
//       quarter: this.drawSVGRest("quarter"),
//       eighth: this.drawSVGRest("eighth"),
//       sixteenth: this.drawSVGRest("sixteenth"),
//       thirtysecond: this.drawSVGRest("thirtysecond"),
//     };
//   }

//   protected drawWholeRest: IRestDrawer = ({
//     drawCanvas,
//     restCenter,
//     measureComponentHeights,
//   }) => {
//     const width = measureComponentHeights.space * 2;
//     const height = measureComponentHeights.space / 2;
//     const x = restCenter.x - width / 2;
//     const y = restCenter.y + height + measureComponentHeights.line / 2;

//     drawCanvas.drawRectangle({ corner: { x, y }, height, width });
//   };

//   protected drawHalfRest: IRestDrawer = ({
//     drawCanvas,
//     restCenter,
//     measureComponentHeights,
//   }) => {
//     const width = measureComponentHeights.space * 2;
//     const height = measureComponentHeights.space / 2;
//     const x = restCenter.x - width / 2;
//     const y = restCenter.y;
//     drawCanvas.drawRectangle({ corner: { x, y }, height, width });
//   };

//   protected drawSVGRest =
//     (type: SVGRest): IRestDrawer =>
//     ({ drawCanvas, restCenter, measureComponentHeights }) => {
//       const { path, viewBox } = getRestSVGData(type);
//       const height = calculateScaleToHeight(
//         viewBox,
//         measureComponentHeights.space * 3
//       );
//       drawCanvas.drawSVG({
//         x: restCenter.x,
//         y: restCenter.y,
//         path,
//         viewBox,
//         center: true,
//         scale: height,
//       });
//     };

//   public drawRest = (
//     type: NoteType,
//     args: Omit<RestDrawerArgs, "drawCanvas">
//   ) => {
//     const restDrawerArgs: RestDrawerArgs = {
//       drawCanvas: this.drawCanvas,
//       ...args,
//     };
//     const drawer = this.drawMap[type];
//     if (drawer) {
//       drawer(restDrawerArgs);
//     }
//   };
// }

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
    const { path, viewBox } = getRestSVGData(type);
    const height = calculateScaleToHeight(
      viewBox,
      measureComponentHeights.space * 3
    );
    drawCanvas.drawSVG({
      x: restCenter.x,
      y: restCenter.y,
      path,
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
