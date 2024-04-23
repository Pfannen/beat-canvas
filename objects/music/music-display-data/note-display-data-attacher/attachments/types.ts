import { NoteDisplayData } from "@/types/music/draw-data";
import { ReadonlyMusic } from "../../../readonly-music";

export type DisplayDataAttachmentContext = {
  music: ReadonlyMusic;
  noteDisplayData: NoteDisplayData[];
  measureIndex: number;
};

export type DisplayDataAttacher = (
  context: DisplayDataAttachmentContext
) => void;
