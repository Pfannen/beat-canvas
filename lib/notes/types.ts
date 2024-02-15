import { NoteType } from "@/components/providers/music/types";
import { ReactNode } from "react";

export interface NoteComponent<T> {
  container: T;
  component: ReactNode;
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

export type NoteProps =
  | { type: "whole"; bodyComponents?: BodyComponent[] }
  | {
      type: Exclude<NoteType, "whole">;
      bodyComponents?: BodyComponent[];
      staffComponents?: StaffComponent[];
    };
