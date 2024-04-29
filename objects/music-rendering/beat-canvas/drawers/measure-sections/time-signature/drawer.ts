import { getTimeSignatureSVGs } from "@/SVG/measure/time-signature";
import { MeasureSectionDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { getSectionCenterX } from "..";
import { calculateScaleToHeight } from "@/utils/svg";

export const timeSignatureSectionDrawer: MeasureSectionDrawer<
  "timeSignature"
> = ({ drawCanvas, data, bodyHeight, section, yPosToAbsolute }) => {
  const { beatNote, beatsPerMeasure } = getTimeSignatureSVGs(data);
  const centerY = yPosToAbsolute(4);
  const x = getSectionCenterX(section);
  const svgHeight = bodyHeight / 2;

  const beatNoteScale = calculateScaleToHeight(beatNote.viewBox, svgHeight);
  const beatNoteCenterY = centerY + svgHeight / 2;

  const bpmScale = calculateScaleToHeight(beatsPerMeasure.viewBox, svgHeight);
  const bpmCenterY = centerY - svgHeight / 2;
  drawCanvas.drawSVG({
    paths: beatNote.paths,
    viewBox: beatNote.viewBox,
    x,
    y: beatNoteCenterY,
    center: true,
    scale: beatNoteScale,
  });

  drawCanvas.drawSVG({
    paths: beatsPerMeasure.paths,
    viewBox: beatsPerMeasure.viewBox,
    x,
    y: bpmCenterY,
    center: true,
    scale: bpmScale,
  });
};
