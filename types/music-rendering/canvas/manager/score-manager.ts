import { ScoreDrawer } from "@/objects/music-rendering/score-drawer";
import { IDrawingCanvas } from "../drawing-canvas";
import { IScoreDrawer, ScoreDrawerConstructor } from "../score-drawer";
import { CanvasManager, ICanvasGetter } from "./canvas-manager";

export interface IScoreDrawerGetter extends ICanvasGetter {
  getScoreDrawerForPage(pageNumber: number): IScoreDrawer;
}

export abstract class ScoreDrawerManager<
    T extends IDrawingCanvas = IDrawingCanvas
  >
  extends CanvasManager<T>
  implements IScoreDrawerGetter
{
  public getScoreDrawerConstructor(): ScoreDrawerConstructor {
    return (drawCanvas, beatCanvas) => {
      return new ScoreDrawer(drawCanvas, beatCanvas);
    };
  }

  getScoreDrawerForPage(pageNumber: number): IScoreDrawer {
    const drawingCanvas = this.getDrawingCanvasPage(pageNumber);
    const beatCanvas = this.getCanvasForPage(pageNumber);
    return this.getScoreDrawerConstructor()(drawingCanvas, beatCanvas);
  }
}
