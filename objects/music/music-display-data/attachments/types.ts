import { NoteDisplayData } from "@/components/providers/music/types";
import { ReadonlyMusic } from "../../measure-data-container";

export type DisplayDataAttachmentContext = {
  music: ReadonlyMusic;
  noteDisplayData: NoteDisplayData[];
  measureIndex: number;
};

export type DisplayDataAttacher = (
  context: DisplayDataAttachmentContext
) => void;
