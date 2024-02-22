import { NoteType } from "@/components/providers/music/types";
import { FunctionComponent } from "react";
import EighthRest from "./eighth";
import QuarterRest from "./quarter";
import SixteenthRest from "./sixteenth";

const restComponentMap: { [key in NoteType]: FunctionComponent } = {
  // whole: QuarterRest,
  // "dotted-half": QuarterRest,
  // half: QuarterRest,
  // "dotted-quarter": QuarterRest,
  quarter: QuarterRest,
  // "dotted-eighth": QuarterRest,
  eighth: EighthRest,
  // "dotted-sixteenth": QuarterRest,
  sixteenth: SixteenthRest,
};

export const getRestComponent = (type: NoteType) => {
  return restComponentMap[type] || QuarterRest;
};
