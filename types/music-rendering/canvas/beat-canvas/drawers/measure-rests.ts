import { IDrawingCanvas } from "../../drawing-canvas";
import { Coordinate } from "@/objects/measurement/types";
import { MeasureComponentValues } from "@/types/music-rendering";
import { NoteType } from "@/components/providers/music/types";

export type SVGRest = Exclude<NoteType, "whole" | "half" | "dotted-half">;

export type RestDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  isDotted: boolean;
  restCenter: Coordinate;
  measureComponentHeights: MeasureComponentValues;
};

export type RestDrawer = (args: RestDrawerArgs) => void;

export type RestDrawers = {
  [K in NoteType]: RestDrawer;
};
