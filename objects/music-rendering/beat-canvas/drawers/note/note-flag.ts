import { FlagDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/note-flags";
import { calculateScaleToHeight } from "@/utils/svg";
import { NoteType } from "@/components/providers/music/types";
import { getFlagSVG } from "@/SVG/note/flag";
import { FlagSVG } from "@/types/svg/music";

const drawSVGFlag =
  (flagSVG: FlagSVG): FlagDrawer =>
  ({ drawCanvas, noteDirection, endOfStem, stemHeight }) => {
    const rotation = noteDirection === "up" ? 0 : 180;
    const scale = calculateScaleToHeight(flagSVG.viewBox, stemHeight * 1);
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
