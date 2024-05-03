import { DeepPartial } from "@/types";
import {
  NoteData,
  MeasureData,
  RestOptions,
  IBeatCanvas,
} from "@/types/music-rendering/canvas/beat-canvas";
import {
  IScoreDrawer,
  ScoreDrawerOptions,
  ScoreDrawerTitleOptions,
  TitleOptions,
} from "@/types/music-rendering/canvas/score-drawer";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { mergePartial } from "@/utils";

export class ScoreDrawer implements IScoreDrawer {
  private drawOptions: ScoreDrawerOptions;
  private beatCanvas: IBeatCanvas;
  private drawingCanvas: IDrawingCanvas;
  constructor(
    drawingCanvas: IDrawingCanvas,
    beatCanvas: IBeatCanvas,
    drawOptions?: DeepPartial<ScoreDrawerOptions>
  ) {
    this.drawOptions = this.combineDrawOptions(drawOptions);
    this.beatCanvas = beatCanvas;
    this.drawingCanvas = drawingCanvas;
  }

  private combineDrawOptions = (
    partialOptions?: DeepPartial<ScoreDrawerOptions>
  ) => {
    const drawOptions = getDefaultDrawOptions();
    mergePartial(drawOptions.title, partialOptions?.title);
    mergePartial(drawOptions.subtitle, partialOptions?.subtitle);
    return drawOptions;
  };

  drawTitle(options: TitleOptions): void {
    const drawOptions = this.drawOptions.title;
    this.drawingCanvas.drawText({
      text: options.text,
      x: options.x,
      y: options.y,
      position: options.position,
      fontFamily: drawOptions.fontFamily,
      fontSize: drawOptions.fontSize,
      fontUnit: "px",
    });
  }

  drawSubtitle(options: TitleOptions): void {
    const drawOptions = this.drawOptions.subtitle;
    this.drawingCanvas.drawText({
      text: options.text,
      x: options.x,
      y: options.y,
      position: options.position,
      fontFamily: drawOptions.fontFamily,
      fontSize: drawOptions.fontSize,
      fontUnit: "px",
    });
  }

  drawNote(options: NoteData) {
    this.beatCanvas.drawNote(options);
  }

  drawMeasure(options: MeasureData) {
    this.beatCanvas.drawMeasure(options);
  }

  drawRest(options: RestOptions) {
    this.beatCanvas.drawRest(options);
  }
}

const getDefaultDrawOptions = () => {
  const titleOptions: ScoreDrawerTitleOptions = {
    fontFamily: "Times New Roman",
    fontSize: 36,
  };

  const subtitleOptions: ScoreDrawerTitleOptions = {
    fontFamily: "Times New Roman",
    fontSize: 24,
  };

  const drawOptions: ScoreDrawerOptions = {
    title: titleOptions,
    subtitle: subtitleOptions,
  };
  return drawOptions;
};
