import { Coordinate } from "@/types";
import { Drawer } from "..";
import { NoteDirection } from "@/types/music";

export type NoteBodyArgs = {
  center: Coordinate;
  bodyHeight: number;
  aspectRatio: number;
  bodyAngle: number;
};

export type NoteBodyDrawer = Drawer<NoteBodyArgs>;
