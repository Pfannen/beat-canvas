import { Coordinate } from "@/types";
import { Drawer } from "..";
import { NoteDirection } from "@/lib/notes/types";

export type NoteBodyArgs = {
  center: Coordinate;
  bodyHeight: number;
  aspectRatio: number;
  bodyAngle: number;
};

export type NoteBodyDrawer = Drawer<NoteBodyArgs>;
