import { NoteType } from "@/components/providers/music/types";
import { FunctionComponent } from "react";

export type YAxis = "top" | "bottom";
export type XAxis = "left" | "right";

export type AxisProps = { xAxis: XAxis; yAxis: YAxis };

export interface NoteComponent<T> {
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

export interface BodyComponent extends NoteComponent<"body"> {
  position: BodyPosition;
}

export type StaffDirection = "toward-body" | "away-from-body";

export interface StaffComponent extends NoteComponent<"staff"> {
  direction: StaffDirection;
  topOffsetPercent?: number;
}

export type NoteDirection = "up" | "down"; //up --> staff is up and on right, down --> staff is down and on left

export type NoteProps<T> =
  | ({ type: "whole"; bodyComponents?: BodyComponent[] } & T)
  | ({
      type: Exclude<NoteType, "whole">;
      bodyComponents?: BodyComponent[];
      staffComponents?: StaffComponent[];
    } & T);
