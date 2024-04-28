import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { ReadonlyMusic } from "../../../readonly-music";
import { Coordinate } from "@/types";
import { UnitConverters } from "@/types/music-rendering";

export type DisplayDataAttachmentContext = {
  music: ReadonlyMusic;
  noteDisplayData: NoteDisplayData[];
  measureIndex: number;
};

export type DisplayDataAttacher = (
  context: DisplayDataAttachmentContext
) => void;

export type NotePositionDel = (
  measureIndex: number,
  noteIndex: number
) => Coordinate;
