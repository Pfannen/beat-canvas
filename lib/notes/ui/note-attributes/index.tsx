import { BodyAttribute, StaffAttribute } from "../../types";
import NoteDot from "./note-dot";

export type NoteAttribute = "sticatto";

export const attributeMap: {
  [attribute in NoteAttribute]: BodyAttribute | StaffAttribute;
} = {
  sticatto: {
    container: "body",
    position: "top",
    component: ({ xAxis, yAxis }) => (
      <NoteDot xAxis={xAxis} yAxis={yAxis} yPercentOffset={-1.5} centerX />
    ),
  },
};
