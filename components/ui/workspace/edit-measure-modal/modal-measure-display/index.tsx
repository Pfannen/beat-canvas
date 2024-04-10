import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent, useMemo } from "react";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { getHTMLCanvas } from "@/utils/music-rendering";

const aspectRatio = 4;

type ModalMeasureDisplayProps = {
  measures: Measure[];
};

const ModalMeasureDisplay: FunctionComponent<ModalMeasureDisplayProps> = ({
  measures,
}) => {
  const dimensions = useMemo(
    () => MusicLayout.getMarginlessSheetMusic(aspectRatio, 1, measures.length),
    [measures.length]
  );
  return getHTMLCanvas(
    aspectRatio,
    measures,
    dimensions,
    {
      getMeasureComponentProps: ({ measureIndex, absoluteYPos }) => ({
        onClick: () => {
          console.log(measureIndex, absoluteYPos);
        },
      }),
    },
    2
  );
};

export default ModalMeasureDisplay;
