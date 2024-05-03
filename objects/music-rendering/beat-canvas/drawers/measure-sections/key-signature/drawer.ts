import { getAccidentalSVG } from "@/SVG/measure/key-signature";
import { MeasureSectionDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { getHeightForAccidentalSVG, getKeySignatureData } from "./widths";
import { iterateSection } from "@/utils/music-rendering/section-calculation";
import { calculateScaleToHeight, getSVGCenterOffsetY } from "@/utils/svg";

export const keySignatureSectionDrawer: MeasureSectionDrawer<
  "keySignature"
> = ({ drawCanvas, data, componentHeights, section, yPosToAbsolute, clef }) => {
  const { symbol, symbolWidth, positions } = getKeySignatureData(
    data,
    clef,
    componentHeights.space
  );
  const svg = getAccidentalSVG(symbol);
  iterateSection(
    section.width,
    section.startX,
    positions.length,
    true,
    (x, i) => {
      const height = getHeightForAccidentalSVG(svg, componentHeights.space);
      const scale = calculateScaleToHeight(svg.viewBox, height);
      const centerYOffset = getSVGCenterOffsetY(svg, height);
      const y = yPosToAbsolute(positions[i]) + centerYOffset;
      drawCanvas.drawSVG({
        paths: svg.paths,
        viewBox: svg.viewBox,
        x,
        y,
        center: true,
        scale,
      });
      x += symbolWidth;
    }
  );
};
