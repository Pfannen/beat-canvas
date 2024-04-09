"use client";

import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import MusicDisplay from "../music-display";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { Measure } from "@/components/providers/music/types";

type MusicCanvasProps = {
  aspectRatio: number;
  measures: Measure[];
  propDelegates?: BeatCanvasPropDelegates;
};

const MusicCanvas: FunctionComponent<MusicCanvasProps> = ({
  aspectRatio,
  measures,
  propDelegates,
}) => {
  return (
    <div
      className={classes.canvas}
      style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
    >
      <MusicDisplay
        aspectRatio={aspectRatio}
        propDelegates={propDelegates}
        measures={measures}
      />
    </div>
  );
};

export default MusicCanvas;
