import { FlagDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note-flags";
import { calculateScaleToHeight } from "@/utils/svg";
import { NoteType } from "@/components/providers/music/types";
import { SVGData } from "@/types/svg";
import { getFlagSVG } from "@/SVG/note/flag";

const drawSVGFlag =
  (flagSVG: SVGData): FlagDrawer =>
  ({ drawCanvas, noteDirection, endOfStem, stemHeight }) => {
    const rotation = noteDirection === "up" ? 0 : 180;
    const scale = calculateScaleToHeight(flagSVG.viewBox, stemHeight / 1.25);
    drawCanvas.drawSVG({
      x: endOfStem.x,
      y: endOfStem.y,
      paths: flagSVG.paths,
      viewBox: flagSVG.viewBox,
      scale,
      drawOptions: { degreeRotation: rotation },
    });
  };

export const getFlagDrawer = (type: NoteType) => {
  const flagSVG = getFlagSVG(type);
  if (flagSVG) {
    return drawSVGFlag(flagSVG);
  }
};
