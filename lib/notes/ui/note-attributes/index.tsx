import { BodyAttribute, StaffAttribute } from "../../types";
import NoteDot from "./note-dot";
import NoteFlag from "./note-flag";
import NoteLine from "./note-line";

export type NoteAttribute =
  | "sticatto"
  | "dotted"
  | "line-through"
  | "eigth-flag"
  | "sixteenth-flag";

export const attributeMap: {
  [attribute in NoteAttribute]: BodyAttribute | StaffAttribute;
} = {
  sticatto: {
    container: "body",
    position: "top",
    component: (props) => (
      <NoteDot {...props} yPercentOffset={-1.5} centerX percentOfBody={0.15} />
    ),
  },
  dotted: {
    container: "body",
    position: "right",
    component: (props) => <NoteDot {...props} centerY xPercentOffset={-1.5} />,
  },
  "line-through": {
    container: "body",
    component: (_) => <NoteLine lineHeight="5%" />,
  },
  "eigth-flag": {
    container: "staff",
    direction: "away-from-body",
    component: (props) => <NoteFlag {...props} />,
  },
  "sixteenth-flag": {
    container: "staff",
    direction: "away-from-body",
    component: (props) => [
      <NoteFlag {...props} />,
      <NoteFlag {...props} flagNumber={1} />,
    ],
  },
};
