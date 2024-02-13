import { ReactElement } from "react";
import { SegmentActionHandler } from "./types";
import { Note, NoteType } from "@/components/providers/music/types";

export type LedgerComponentRenderer = (
  yPos: number,
  isLine: boolean,
  lineHeightPercentage: number,
  spaceHeightPercentage: number,
  isBodyComponent: boolean
) => ReactElement;

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  lineHeight: number,
  spaceHeight: number,
  startWithLine: boolean,
  getComponent: LedgerComponentRenderer,
  bodyCt = 7
) => {
  const totalComponents = bodyCt + belowBody + aboveBody;
  const components = new Array(totalComponents);

  for (let y = totalComponents - 1; y > -1; y--) {
    let isLine = y % 2 != 0;
    if (startWithLine) isLine = !isLine;
    const isBodyComponent = y >= belowBody && y < belowBody + bodyCt;
    components.push(
      getComponent(y, isLine, lineHeight, spaceHeight, isBodyComponent)
    );
  }
  return components;
};

/* Note Placement Functionalities */

type ModifierDelegates = {
  splitSegment: (x: number) => void;
  joinSegment: (x: number) => void;
  joinAll: (x: number) => void;
  placeNote: (note: Note) => void;
};

export type ModificationBehavior<T> = (
  delegates: ModifierDelegates,
  noteType?: NoteType
) => SegmentActionHandler<T>;

export const clickBehavior: ModificationBehavior<
  "left-click" | "middle-click"
> = (delegates, type) => (action, x, y) => {
  //If action is click, if note is selected, invoke add note
  //Need to receive addNote and
  if (action === "left-click") {
    if (type) {
      delegates.placeNote({ x, y, type });
      delegates.joinAll(x);
    } else {
      delegates.splitSegment(x);
    }
  } else if (action === "middle-click") {
    console.log("Middle");
    delegates.joinSegment(x);
  }
};
