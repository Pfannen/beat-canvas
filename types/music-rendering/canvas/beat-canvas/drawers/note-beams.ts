import { IDrawingCanvas } from "../../drawing-canvas";
import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";
import { NoteBeamInfo } from "@/types/music/draw-data";

export type NoteBeamDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  beamData: NoteBeamInfo;
  endOfStem: Coordinate;
  noteDirection: NoteDirection;
  beamHeight: number;
  beamGap: number;
};

export type NoteBeamDrawer = (args: NoteBeamDrawerArgs) => void;
