import {
  Measure,
  Note,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { NoteDisplayData } from "../music-rendering/draw-data/note";

export type Rest = { x: number; type: NoteType; isDotted: boolean };

export type NoteComponent = {
  type: "note";
  note: Note; //*x is in terms of the segment it belongs to*
  renderData: NoteDisplayData;
};
export type RestComponent = { type: "rest"; rest: Rest };

export type MeasureComponent = NoteComponent | RestComponent;

export type MeasureRenderData = {
  components: MeasureComponent[];
} & Omit<Measure, "notes"> & { timeSignature?: TimeSignature }; //keySignature?: KeySignature,
