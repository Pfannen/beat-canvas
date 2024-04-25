import { IDrawingCanvas } from "../../drawing-canvas";
import { Coordinate } from "@/types";
import { Accidental } from "@/types/music";

export type TKeySignatureDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  symbol: Accidental;
  symbolHeight: number;
  positions: Coordinate[];
};

export type KeySignatureDrawer = (args: TKeySignatureDrawerArgs) => void;
