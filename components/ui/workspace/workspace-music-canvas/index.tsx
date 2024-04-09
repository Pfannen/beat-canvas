"use client";

import { useMusic } from "@/components/providers/music";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import MusicCanvas from "../../home/music-canvas";

type WorkspaceMusicCanvasProps = {
  onMeasureClick: (index: number) => void;
  isMeasureSelected: (index: number) => boolean;
  areMeasuresSelected: boolean;
};

const WorkspaceMusicCanvas: FunctionComponent<WorkspaceMusicCanvasProps> = ({
  onMeasureClick,
  isMeasureSelected,
  areMeasuresSelected,
}) => {
  const { measures } = useMusic();
  return (
    <MusicCanvas
      measures={measures}
      aspectRatio={0.75}
      propDelegates={{
        getMeasureProps: ({ measureIndex }) => {
          return {
            onClick: onMeasureClick.bind(null, measureIndex),
            className: areMeasuresSelected
              ? isMeasureSelected(measureIndex)
                ? classes.selected
                : classes.not_selected
              : "",
          };
        },
      }}
    />
  );
};

export default WorkspaceMusicCanvas;
