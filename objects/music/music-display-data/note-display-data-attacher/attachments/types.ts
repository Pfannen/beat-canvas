import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { ReadonlyMusic } from "../../../readonly-music";

export type DisplayDataAttachmentContext = {
  music: ReadonlyMusic;
  noteDisplayData: NoteDisplayData[];
  measureIndex: number;
};

export type DisplayDataAttacher = (
  context: DisplayDataAttachmentContext
) => void;
