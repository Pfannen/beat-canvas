import { NoteType } from "@/components/providers/music/types";
import { NoteStemDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/note-stem";

export const noteStemDrawer: NoteStemDrawer = ({
  drawCanvas,
  direction,
  bodyCenter,
  bodyWidth,
  stemHeight,
  stemWidth,
}) => {
  const widthRadius = bodyWidth / 2;
  let x;
  if (direction === "up") {
    x = bodyCenter.x + widthRadius;
    stemWidth *= -1;
  } else {
    x = bodyCenter.x - widthRadius;
    stemHeight *= -1;
  }
  drawCanvas.drawRectangle({
    corner: { x, y: bodyCenter.y },
    height: stemHeight,
    width: stemWidth,
  });
  return { x, y: bodyCenter.y + stemHeight };
};

export const getNoteStemDrawer = (type: NoteType) => {
  if (type !== "whole") return noteStemDrawer;
};
