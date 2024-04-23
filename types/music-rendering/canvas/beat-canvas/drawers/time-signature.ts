import { IDrawingCanvas } from "../../drawing-canvas";
import { Coordinate } from "@/types";
import { Accidental } from "@/types/music";

export type TimeSignatureDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  symbol: Accidental;
  symbolHeight: number;
  positions: Coordinate[];
};

export type TimeSignatureDrawer = (args: TimeSignatureDrawerArgs) => void;
