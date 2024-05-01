import { IBeatCanvas } from "../beat-canvas";
import {
  DrawingCanvasFontFamily,
  DrawingCanvasTextPosition,
  IDrawingCanvas,
} from "../drawing-canvas";

export type ScoreDrawerTitleOptions = {
  fontSize: number;
  fontFamily: DrawingCanvasFontFamily;
};

export type ScoreDrawerOptions = {
  title: ScoreDrawerTitleOptions;
  subtitle: ScoreDrawerTitleOptions;
};

export type TitleOptions = {
  text: string;
  x: number;
  y: number;
  position: DrawingCanvasTextPosition;
};

export type ScoreDrawerConstructor = (
  drawingCanvas: IDrawingCanvas,
  beatCanvas: IBeatCanvas
) => IScoreDrawer;

export interface IScoreDrawer extends IBeatCanvas {
  drawTitle(options: TitleOptions): void;
  drawSubtitle(options: TitleOptions): void;
}
