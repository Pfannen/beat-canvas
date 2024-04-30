import { IDrawingCanvas } from "../../../drawing-canvas";
import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";
import { NoteBeamInfo } from "@/types/music-rendering/draw-data/note";

export type NoteBeamDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  beamData: NoteBeamInfo;
  endOfStem: Coordinate;
  stemWidth: number;
  noteDirection: NoteDirection;
  beamHeight: number;
  beamGap: number;
};

export type NoteBeamDrawer = (args: NoteBeamDrawerArgs) => void;
