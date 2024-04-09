"use client";

import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import MusicDisplay from "../music-display";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/clickable-beat-canvas";

type MusicCanvasProps = {
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  aspectRatio,
  propDelegates,
}) => {
  return (
    <div
      className={classes.canvas}
      style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
    >
      <MusicDisplay aspectRatio={aspectRatio} propDelegates={propDelegates} />
    </div>
  );
};

export default MusicCanvas;
