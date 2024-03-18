import { NoteDirection } from "@/lib/notes/types";
import {
  IBeatCanvas,
  IDrawingCanvas,
  MeasureOptions,
  NoteOptions,
} from "@/types/music-rendering/canvas";
import { Coordinate } from "../measurement/types";

type StemOptions = {
  width: number;
  height: number;
  direction: NoteDirection;
  cornerCoordinate: Coordinate;
};

export class BeatCanvas implements IBeatCanvas {
  canvas: IDrawingCanvas;
  constructor(canvas: IDrawingCanvas) {
    this.canvas = canvas;
  }
  drawNote(options: NoteOptions): void {
    throw new Error("Method not implemented.");
  }
  drawMeasure(options: MeasureOptions): void {
    throw new Error("Method not implemented.");
  }

  private drawStem(options: StemOptions): void {
    const heightAddValue =
      options.direction === "up" ? options.height : -options.height;
    const end = {
      x: options.cornerCoordinate.x,
      y: options.cornerCoordinate.y + heightAddValue,
    };
    this.canvas.drawLine({
      start: options.cornerCoordinate,
      end,
      thickness: options.width,
    });
  }

  private drawBeamFlag(): void {}

  private drawNoteFlag(): void {}
}
