import { ReactElement } from "react";
import { SegmentActionHandler } from "./types";
import { Note, NoteType } from "@/components/providers/music/types";

export type LedgerComponentRenderer = (
  yPos: number,
  isLine: boolean,
  heightPercentage: string,
  isBodyComponent: boolean
) => ReactElement;

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  lineHeight: string,
  spaceHeight: string,
  startWithLine: boolean,
  getComponent: LedgerComponentRenderer,
  bodyCt = 7
) => {
  const above = new Array(aboveBody);
  const body = new Array(bodyCt);
  const below = new Array(belowBody);
  const totalComponents = bodyCt + belowBody + aboveBody;

  for (let y = totalComponents - 1; y > -1; y--) {
    let isLine = y % 2 != 0;

    if (startWithLine) isLine = !isLine;
    const height = isLine ? lineHeight : spaceHeight;
    if (y < belowBody) {
      below.push(getComponent(y, isLine, height, false));
    } else if (y < belowBody + bodyCt) {
      body.push(getComponent(y, isLine, height, true));
    } else {
      above.push(getComponent(y, isLine, height, false));
    }
  }
  return [above, body, below];
};

/* Note Placement Functionalities */

type ModifierDelegates = {
  splitSegment: (x: number) => void;
  joinSegment: (x: number) => void;
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
    } else {
      delegates.splitSegment(x);
    }
  } else if (action === "middle-click") {
    console.log("Middle");
    delegates.joinSegment(x);
  }
};
