import { NoteDirection } from "@/lib/notes/types";
import { NonBodyDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/non-body";

export const nonBodyDrawer: NonBodyDrawer = ({
  drawCanvas,
  direction,
  measureHeights,
  lineCount,
  isOnLine,
  bodyCenter,
  width,
}) => {
  let y;
  const x = bodyCenter.x - width / 2;
  const incrementor = getIncrementor(direction);
  const incrementAmount = measureHeights.space + measureHeights.line;
  if (!isOnLine) y = incrementor(bodyCenter.y, measureHeights.space / 2);
  else y = bodyCenter.y - measureHeights.line / 2;
  for (let i = 0; i < lineCount; i++) {
    drawCanvas.drawRectangle({
      corner: { x, y },
      height: measureHeights.line,
      width: width,
    });
    y = incrementor(y, incrementAmount);
  }
};

const getIncrementor = (direction: NoteDirection) => {
  if (direction === "up") {
    return (y: number, height: number) => y + height;
  }
  return (y: number, height: number) => y - height;
};
