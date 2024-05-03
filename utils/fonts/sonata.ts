import { NoteType } from "@/components/providers/music/types";
import { Dynamic } from "@/types/music/note-annotations";

const sonataDynamicMap: Partial<Record<Dynamic, string>> = {
  mp: "P",
  mf: "F",
};

export const getDynamicSonataString = (dynamic: Dynamic) => {
  return sonataDynamicMap[dynamic] || dynamic;
};

const sonataNoteMap: Record<NoteType, string> = {
  whole: "W",
  half: "h",
  quarter: "q",
  eighth: "e",
  sixteenth: "x",
  thirtysecond: "r",
  sixtyfourth: "R",
};

export const getNoteSonataString = (note: NoteType) => {
  return sonataNoteMap[note];
};
