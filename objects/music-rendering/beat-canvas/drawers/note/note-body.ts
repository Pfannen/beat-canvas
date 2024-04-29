import { NoteType } from "@/components/providers/music/types";
import { NoteBodyDrawer } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/note-body";

const whole: NoteBodyDrawer = ({
  drawCanvas,
  center,
  bodyHeight,
  aspectRatio,
}) => {
  drawCanvas.drawEllipse({
    center,
    aspectRatio,
    diameter: bodyHeight,
    drawOptions: { degreeRotation: 0 },
  });

  drawCanvas.drawEllipse({
    center,
    aspectRatio,
    diameter: bodyHeight * 0.6,
    drawOptions: { degreeRotation: 72, color: "white" },
  });
};

const half: NoteBodyDrawer = (args) => {
  noteBodyDrawer(args);

  args.drawCanvas.drawEllipse({
    center: args.center,
    aspectRatio: args.aspectRatio * 2,
    diameter: args.bodyHeight * 0.4,
    drawOptions: { degreeRotation: args.bodyAngle * 1.8, color: "white" },
  });
};

const noteBodyDrawer: NoteBodyDrawer = ({
  drawCanvas,
  center,
  bodyHeight,
  aspectRatio,
  bodyAngle,
}) => {
  drawCanvas.drawEllipse({
    center,
    aspectRatio,
    diameter: bodyHeight,
    drawOptions: { degreeRotation: bodyAngle },
  });
};

const bodyDrawers: Partial<Record<NoteType, NoteBodyDrawer>> = {
  whole,
  half,
};

export const getNoteBodyDrawer = (type: NoteType) => {
  return bodyDrawers[type] || noteBodyDrawer;
};
