import {
  DynamicMeasureAttribute,
  DynamicMeasureAttributes,
  Wedge,
} from "@/types/music";
import {
  DynamicAttributeDel,
  DynamicAttributeDelegates,
  DynamicAttributeDrawer,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/dynamic-attributes";
import {
  getDynamicSonataString,
  getNoteSonataString,
} from "@/utils/fonts/sonata";
import { beatNoteToNoteType } from "@/utils/music";

const dynamicFontSize = 16;
const metronomeFontSize = 14;

const paddingFraction = 0.15;

const drawDynamic: DynamicAttributeDel<"dynamic"> =
  (dynamic) =>
  ({ drawCanvas, measureYValues, bodyHeight, noteStartX }) => {
    const text = getDynamicSonataString(dynamic);
    const padding = bodyHeight * paddingFraction;
    const y = measureYValues.bottom - padding;
    drawCanvas.drawText({
      text,
      x: noteStartX,
      y,
      fontFamily: "Sonata",
      fontSize: dynamicFontSize,
      position: "bottomLeft",
      fontUnit: "px",
    });
  };

const drawMetronome: DynamicAttributeDel<"metronome"> =
  (metronome) =>
  ({ drawCanvas, measureYValues, bodyHeight, noteStartX }) => {
    const note = beatNoteToNoteType(metronome.beatNote);
    const text = `${getNoteSonataString(note)} ${metronome.beatsPerMinute}`;
    const padding = bodyHeight * paddingFraction;
    const y = measureYValues.top + padding;
    drawCanvas.drawText({
      text,
      x: noteStartX,
      y,
      fontFamily: "Sonata",
      fontSize: metronomeFontSize,
      position: "bottomLeft",
      fontUnit: "px",
    });
  };

const dynamicAttributeDelegates: DynamicAttributeDelegates = {
  metronome: drawMetronome,
  dynamic: drawDynamic,
  wedge: function (data: Wedge | undefined): DynamicAttributeDrawer {
    return () => {};
  },
};

export const getDynamicAttributeDrawer = <T extends DynamicMeasureAttribute>(
  attribute: T,
  data: DynamicMeasureAttributes[T]
) => {
  return dynamicAttributeDelegates[attribute](data);
};
