import { NoteType } from "@/components/providers/music/types";
import { IDrawingCanvas } from "../../../drawing-canvas";
import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";

export type FlagNote = Exclude<NoteType, "whole" | "half" | "quarter">;

export type FlagDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  noteDirection: NoteDirection;
  endOfStem: Coordinate;
  stemHeight: number;
  stemWidth: number;
};

export type FlagDrawer = (args: FlagDrawerArgs) => void;

export type FlagDrawers = {
  [K in FlagNote]: FlagDrawer;
};
