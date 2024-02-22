import { NoteType } from "@/components/providers/music/types";
import { FunctionComponent } from "react";
import EighthRest from "./eighth";

// const restComponentMap: {[key in NoteType]: FunctionComponent} = {
//     "whole"
// }

export const getRestComponent = (type: NoteType) => {
  return EighthRest;
};
