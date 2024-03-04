import { FunctionComponent, Key } from "react";
import { NoteProps } from "./ui/note";

export type YAxis = "top" | "bottom";
export type XAxis = "left" | "right";

export type Axis = { xAxis: XAxis; yAxis: YAxis };

export type AxisProps = Partial<Axis>;

type RequiredNotePropKeys =
  | "staffHeightMultiplier"
  | "staffWidthMultipler"
  | "type"
  | "direction"
  | "bodyHeight"
  | "unit";

export type AttributeNoteProps = Required<
  Pick<NoteProps, RequiredNotePropKeys>
> &
  Omit<NoteProps, RequiredNotePropKeys>;

export interface NoteAttributeComponent<T> {
  container: T;
  component: (
    axisProps: AxisProps,
    noteProps: AttributeNoteProps
  ) => ReturnType<FunctionComponent>;
}

export type BodyPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "staff-side"
  | "non-staff-side";

export interface BodyAttribute extends NoteAttributeComponent<"body"> {
  position?: BodyPosition;
}

export type StaffDirection = "toward-body" | "away-from-body";

export interface StaffAttribute extends NoteAttributeComponent<"staff"> {
  direction?: StaffDirection;
  topOffsetPercent?: number;
}

export type NoteDirection = "up" | "down"; //up --> staff is up and on right, down --> staff is down and on left

// export type NoteProps<T> =
//   | ({ type: "whole"; bodyComponents?: BodyAttribute[] } & T)
//   | ({
//       type: Exclude<NoteType, "whole">;
//       bodyComponents?: BodyAttribute[];
//       staffComponents?: StaffAttribute[];
//     } & T);
