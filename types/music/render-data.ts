import {
  Measure,
  Note,
  NoteDisplayData,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";

export type Rest = { x: number; type: NoteType };

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
