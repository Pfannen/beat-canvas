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

type AttributeGetter<Props> = (props: Props) => BodyAttribute | StaffAttribute;

const getLineThrough: AttributeGetter<{ lineHeight: string }> = ({
  lineHeight,
}) => {
  return {
    container: "body",
    component: (_) => <NoteLine lineHeight={lineHeight} />,
  };
};

const sticatto: BodyAttribute = {
  container: "body",
  position: "top",
  component: (props) => (
    <NoteDot {...props} yPercentOffset={-1.5} centerX percentOfBody={0.15} />
  ),
};
const dotted: BodyAttribute = {
  container: "body",
  position: "right",
  component: (props) => <NoteDot {...props} centerY xPercentOffset={-1.5} />,
};

const eighthFlag: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  component: (props) => <NoteFlag {...props} />,
};

const sixteenthAttribute: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  component: (props) => [
    <NoteFlag {...props} />,
    <NoteFlag {...props} flagNumber={1} />,
  ],
};

export const attributeMap = {
  sticatto,
  dotted,
  "eigth-flag": eighthFlag,
  "sixteenth-flag": sixteenthAttribute,
};

export const attributeGetters = {
  "line-through": getLineThrough,
};

export type NonConfigAttributes = keyof typeof attributeMap;
