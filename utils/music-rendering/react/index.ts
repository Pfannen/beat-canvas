import { Measure } from "@/components/providers/music/types";
import { Measurements } from "@/objects/measurement/measurements";
import { RelativeClickableBeatCanvas } from "@/objects/music-rendering/beat-canvas/relative-clickable-beat-canvas";
import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MeasureSectionToggle } from "@/types/music-rendering";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { MusicDimensionData } from "@/types/music-rendering/music-layout";

export const getRelativeBeatCanvas = (
  drawingCanvas: ReactDrawingCanvas,
  aspectRatio: number,
  measurements: Measurements,
  delegates?: BeatCanvasPropDelegates,
  drawAboveBelow?: boolean
) => {
  const converter = (xValue: number) => xValue / aspectRatio;
  const beatCanvas = new RelativeClickableBeatCanvas(
    converter,
    drawingCanvas,
    measurements,
    delegates,
    {
      note: {
        noteBodyAspectRatio: converter(1.5),
        dotAnnotationAspectRatio: converter(1),
      },
    }, //1.5 is the original ratio
    drawAboveBelow
  );
  return beatCanvas;
};

export const drawMeasures = (
  measures: Measure[],
  dimensions: MusicDimensionData,
  measurements: Measurements,
  manager: CanvasManager<any>,
  sectionToggleList?: MeasureSectionToggle
) => {
  const renderer = new MeasureRenderer(
    measures,
    dimensions,
    manager,
    measurements,
    sectionToggleList
  );
  renderer.render();
};
