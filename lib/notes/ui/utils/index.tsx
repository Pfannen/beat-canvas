import { ReactNode } from "react";
import {
  Axis,
  BodyAttribute,
  BodyPosition,
  NoteDirection,
  StaffAttribute,
  StaffDirection,
  XAxis,
  YAxis,
} from "../../types";
import { NonConfigAttributes, attributeMap } from "../note-attributes";
import { NoteType } from "@/components/providers/music/types";

type AttributeReducer = (attribute: BodyAttribute | StaffAttribute) => void;

export const reduceAttributes = (
  direction: NoteDirection,
  type: NoteType,
  attributes: NonConfigAttributes[] = [],
  extraAttributes: (BodyAttribute | StaffAttribute)[] = [],
  getTypeComponents = true
) => {
  const bodyComponents: ReactNode[] = [];
  const staffComponents: ReactNode[] = [];

  const reducer: AttributeReducer = (
    attribute: BodyAttribute | StaffAttribute
  ) => {
    if (attribute.container === "body") {
      bodyComponents.push(getBodyComponent(direction, attribute));
    } else {
      staffComponents.push(getStaffComponent(direction, attribute));
    }
  };

  reduceNonConfigAttributes(attributes, reducer);
  if (getTypeComponents) {
    reduceNonConfigAttributes(getNoteTypeComponents(type), reducer);
  }
  extraAttributes.forEach((a) => {
    reducer(a);
  });

  return { bodyComponents, staffComponents };
};

const reduceNonConfigAttributes = (
  attributes: NonConfigAttributes[],
  reducer: AttributeReducer
) => {
  attributes.forEach((attribute) => {
    const a = attributeMap[attribute];
    reducer(a);
  });
};

const getBodyComponent = (
  direction: NoteDirection,
  attribute: BodyAttribute
) => {
  const position = getBodyPosition(direction, attribute.position || "top");
  const Component = attribute.component;
  return <Component {...position} key={attribute.key} />;
};

const getStaffComponent = (
  direction: NoteDirection,
  attribute: StaffAttribute
) => {
  const Component = attribute.component;
  const dir = getStaffDirection(direction, attribute.direction);
  return <Component {...dir} key={attribute.key} />;
};

const getBodyPosition = (
  direction: NoteDirection,
  position: BodyPosition
): Axis => {
  let yAxis: YAxis = "top";
  let xAxis: XAxis = "left";
  if (position === "non-staff-side") {
    if (direction !== "up") xAxis = "right";
  } else if (position === "staff-side") {
    if (direction === "up") xAxis = "right";
  } else if (position === "left" || position === "right") {
    xAxis = position;
  } else {
    yAxis = position;
  }
  return { yAxis, xAxis };
};

const getStaffDirection = (
  direction: NoteDirection,
  staffDirection: StaffDirection = "away-from-body"
): Axis => {
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

const getNoteTypeComponents = (type: NoteType): NonConfigAttributes[] => {
  if (type === "dotted-eighth" || type === "eighth") {
    return ["eighth-flag"];
  } else if (type === "dotted-sixteenth" || type === "sixteenth") {
    return ["sixteenth-flag"];
  }
  return [];
};

const isNotFilled = (type: NoteType) =>
  type === "whole" || type === "half" || type === "dotted-half";

const isNotStaffed = (type: NoteType) => type === "whole";

export const getTypeDetails = (type: NoteType) => {
  return { isFilled: !isNotFilled(type), isStaffed: !isNotStaffed(type) };
};
