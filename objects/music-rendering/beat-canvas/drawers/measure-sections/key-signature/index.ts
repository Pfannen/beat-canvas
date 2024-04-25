import { KeySignatureDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/time-signature";
import { getAccidentalSVG } from "./accidental-svgs";
import { calculateScaleToHeight } from "@/utils/svg";

export const keySignatureDrawer: KeySignatureDrawer = ({
  drawCanvas,
  symbol,
  symbolHeight,
  positions,
}) => {
  const accidentalSVG = getAccidentalSVG(symbol);
  const scale = calculateScaleToHeight(accidentalSVG.viewBox, symbolHeight);
  positions.forEach(({ x, y }) => {
    drawCanvas.drawSVG({
      x,
      y,
      scale,
      path: accidentalSVG.path,
      viewBox: accidentalSVG.viewBox,
      center: true,
    });
  });
};
