import {
  FlagDrawer,
  FlagNote,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/note-flags";
import { getFlagSVG } from "./flag-svgs";
import { calculateScaleToHeight } from "@/utils/svg";

const drawSVGFlag =
  (type: FlagNote): FlagDrawer =>
  ({ drawCanvas, noteDirection, endOfStem, stemHeight }) => {
    const svgData = getFlagSVG(type);
    const rotation = noteDirection === "up" ? 0 : 180;
    const scale = calculateScaleToHeight(svgData.viewBox, stemHeight / 1.25);
    drawCanvas.drawSVG({
      x: endOfStem.x,
      y: endOfStem.y,
      path: svgData.path,
      viewBox: svgData.viewBox,
      scale,
      drawOptions: { degreeRotation: rotation },
    });
  };

export const getFlagDrawer = (type: FlagNote) => {
  return drawSVGFlag(type);
};
