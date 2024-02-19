import { UnitMeasurement } from "@/types";
import NoteBody from "../note-body";
import NoteStaff from "../note-staff";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import {
  BodyPosition,
  NoteDirection,
  StaffDirection,
  XAxis,
  YAxis,
} from "../../types";
import { numToUnit } from "@/utils";
import { NoteAttribute, attributeMap } from "../note-attributes";
import { NoteType } from "@/components/providers/music/types";

type NoteProps = {
  type: NoteType;
  bodyHeight?: number;
  staffHeightMultiplier?: number;
  unit?: UnitMeasurement;
  direction?: NoteDirection;
  attributes?: NoteAttribute[];
};

const Note: FunctionComponent<NoteProps> = (props) => {
  const {
    bodyHeight = 1,
    staffHeightMultiplier = 1.75,
    unit = "%",
    direction = "up",
  } = props;

  const { bodyComponents, staffComponents } = reduceAttributes(
    direction,
    props.attributes
  );

  const isNonFilledNote =
    props.type === "whole" ||
    props.type === "dotted-half" ||
    props.type === "half";
  const isStaffNote = props.type !== "whole";
  return (
    <NoteBody height={numToUnit(bodyHeight, unit)} notFilled={isNonFilledNote}>
      {isStaffNote && (
        <NoteStaff
          heightMultiplier={staffHeightMultiplier}
          direction={direction}
        >
          {staffComponents}
        </NoteStaff>
      )}
      {bodyComponents}
    </NoteBody>
  );
};

export default Note;

const reduceAttributes = (
  direction: NoteDirection,
  attributes?: NoteAttribute[]
) => {
  const bodyComponents: ReactNode[] = [];
  const staffComponents: ReactNode[] = [];
  attributes?.forEach((attribute) => {
    const a = attributeMap[attribute];
    const Component = a.component;
    if (a.container === "body") {
      const position = getBodyPosition(direction, a.position || "top");
      const isXAxis = !isYAxis(position);

      bodyComponents.push(
        <Component
          xAxis={(isXAxis ? position : "left") as XAxis}
          yAxis={(isXAxis ? "top" : position) as YAxis}
        />
      );
    } else {
      const dir = getStaffDirection(direction, a.direction || "away-from-body");
      staffComponents.push(<Component {...dir} />);
    }
  });
  return { bodyComponents, staffComponents };
};

const getBodyPosition = (
  direction: NoteDirection,
  position: BodyPosition
): XAxis | YAxis => {
  if (position === "non-staff-side")
    return direction === "up" ? "left" : "right";
  if (position === "staff-side") return direction === "up" ? "right" : "left";
  return position;
};

const getStaffDirection = (
  direction: NoteDirection,
  staffDirection: StaffDirection
): { xAxis: XAxis; yAxis: YAxis } => {
  if (direction === "up") {
    const yAxis = "top";
    if (staffDirection === "away-from-body") return { xAxis: "left", yAxis };
    return { xAxis: "right", yAxis };
  } else {
    const yAxis = "bottom";
    if (staffDirection === "away-from-body") return { xAxis: "right", yAxis };
    return { xAxis: "left", yAxis };
  }
};

const isYAxis = (axis: XAxis | YAxis) => axis === "bottom" || axis === "top";
