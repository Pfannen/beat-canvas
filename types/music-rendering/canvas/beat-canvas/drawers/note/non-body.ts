import { Drawer } from "..";
import { NoteDirection } from "@/types/music";
import { Coordinate } from "@/types";
import { MeasureComponentValues } from "@/types/music-rendering";

export type NonBodyDrawerArgs = {
  isOnLine: boolean;
  lineCount: number;
  direction: NoteDirection;
  width: number;
  measureHeights: MeasureComponentValues;
  bodyCenter: Coordinate;
};

export type NonBodyDrawer = Drawer<NonBodyDrawerArgs>;
