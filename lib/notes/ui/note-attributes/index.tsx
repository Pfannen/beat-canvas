import { BodyAttribute, StaffAttribute } from "../../types";
import EighthFlag from "./eighth-flag";
import NoteDot from "./note-dot";
import NoteFlag from "./note-flag";
import NoteLine from "./note-line";

export type NoteAttribute =
  | "sticatto"
  | "dotted"
  | "line-through"
  | "eighth-flag"
  | "sixteenth-flag";

const sticatto: BodyAttribute = {
  container: "body",
  position: "top",
  key: "sticatto",
  component: (props) => (
    <NoteDot {...props} yPercentOffset={-1.5} centerX percentOfBody={0.15} />
  ),
};
const dotted: BodyAttribute = {
  container: "body",
  position: "right",
  key: "dotted",
  component: (props) => <NoteDot {...props} centerY xPercentOffset={-1.5} />,
};

const eighthFlag: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  key: "flag-0",
  component: (props) => <EighthFlag {...props} />,
};

const sixteenthAttribute: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  key: "flag-1",
  component: (props) => [
    <NoteFlag {...props} />,
    <NoteFlag {...props} flagNumber={1} />,
  ],
};

export const attributeMap = {
  sticatto,
  dotted,
  "eighth-flag": eighthFlag,
  "sixteenth-flag": sixteenthAttribute,
};

type AttributeGetter<Props> = (props: Props) => BodyAttribute | StaffAttribute;

export const getLineThrough: AttributeGetter<{ lineHeight: string }> = ({
  lineHeight,
}) => {
  return {
    container: "body",
    key: "line-through",
    component: (_) => <NoteLine lineHeight={lineHeight} />,
  };
};

export type NonConfigAttributes = keyof typeof attributeMap;
