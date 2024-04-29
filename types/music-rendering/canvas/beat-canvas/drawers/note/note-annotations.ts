import { NoteAnnotation } from "@/types/music/note-annotations";
import { BeatCanvasNoteDrawOptions, DirectionOffsets, NoteData } from "../..";
import { IDrawingCanvas } from "../../../drawing-canvas";

export type NoteAnnotationDrawerArgs = {
  drawCanvas: IDrawingCanvas;
  noteData: Omit<NoteData, "annotations">;
  noteDrawOptions: BeatCanvasNoteDrawOptions;
  offsets: DirectionOffsets;
};

export type NoteAnnotationDrawer = (args: NoteAnnotationDrawerArgs) => void;

export type NoteAnnotationDrawers = {
  [K in NoteAnnotation]: NoteAnnotationDrawer;
};
