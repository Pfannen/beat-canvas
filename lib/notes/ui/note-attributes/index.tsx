import { fractionToPercent, numToUnit } from "@/utils";
import { BodyAttribute, StaffAttribute } from "../../types";
import NoteBeam from "./note-beam";
import NoteDot from "./note-dot";
import NoteFlag from "./note-flag";
import NoteLine from "./note-line";

export type NoteAttribute = "sticatto" | "dotted" | "line-through";

const sticatto: BodyAttribute = {
  container: "body",
  position: "top",
  component: (axisProps) => (
    <NoteDot
      {...axisProps}
      yPercentOffset={-1.5}
      centerX
      percentOfBody={0.15}
      key={"sticatto"}
    />
  ),
};
const dotted: BodyAttribute = {
  container: "body",
  position: "right",
  component: (axisProps) => (
    <NoteDot {...axisProps} centerY xPercentOffset={-1.5} key={"dotted"} />
  ),
};

const eighthFlag: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  component: (axisProps) => <NoteFlag {...axisProps} key={"flag-0"} />,
};

const sixteenthAttribute: StaffAttribute = {
  container: "staff",
  direction: "away-from-body",
  component: (axisProps) => (
    <>
      <NoteFlag {...axisProps} key={"flag-1"} />
      <NoteFlag {...axisProps} flagNumber={1} key={"flag-2"} />
    </>
  ),
};

export const attributeMap = {
  sticatto,
  dotted,
  "eighth-flag": eighthFlag,
  "sixteenth-flag": sixteenthAttribute,
};

type AttributeGetter<Props> = (props: Props) => BodyAttribute | StaffAttribute;

export const getNoteBeam: AttributeGetter<{
  lengthInBodyUnits: number;
  widthFraction: number;
  angleDeg: number;
}> = ({ lengthInBodyUnits, widthFraction, angleDeg }) => {
  return {
    container: "staff",
    component: (axisProps, noteProps) => {
      const lengthInBodyPercentage = lengthInBodyUnits * noteProps.bodyHeight;
      console.log({
        lengthInBodyPercentage,
        mult: noteProps.staffHeightMultiplier,
      });
      const lengthInStaffPercentage =
        lengthInBodyPercentage / noteProps.staffHeightMultiplier;
      return (
        <NoteBeam
          {...axisProps}
          angle={numToUnit(angleDeg, "deg")}
          width={fractionToPercent(widthFraction)}
          length={fractionToPercent(lengthInStaffPercentage)}
          key={`note-beam-${lengthInBodyUnits}-${angleDeg}`}
        />
      );
    },
  };
};

export const getLineThrough: AttributeGetter<{ lineHeight: string }> = ({
  lineHeight,
}) => {
  return {
    container: "body",
    component: (_) => <NoteLine lineHeight={lineHeight} key={"line-through"} />,
  };
};

export type NonConfigAttributes = keyof typeof attributeMap;
