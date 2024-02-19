import { NoteType } from "@/components/providers/music/types";
import { FunctionComponent } from "react";

export type YAxis = "top" | "bottom";
export type XAxis = "left" | "right";

export type AxisProps = { xAxis?: XAxis; yAxis?: YAxis };

export interface NoteAttributeComponent<T> {
  container: T;
  component: FunctionComponent<AxisProps>;
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
