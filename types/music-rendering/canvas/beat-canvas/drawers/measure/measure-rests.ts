import { IDrawingCanvas } from "../../../drawing-canvas";
import { Coordinate } from "@/types";
import { MeasureComponentValues } from "@/types/music-rendering";
import { NoteType } from "@/components/providers/music/types";
import { Drawer } from "..";

export type SVGRest = Exclude<NoteType, "whole" | "half" | "dotted-half">;

export type RestDrawerArgs = {
  isDotted: boolean;
  restCenter: Coordinate;
  measureComponentHeights: MeasureComponentValues;
};

export type RestDrawer = Drawer<RestDrawerArgs>;

export type RestDrawers = {
  [K in NoteType]: RestDrawer;
};
