import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { FunctionComponent, useMemo } from "react";
import { BeatCanvasPropDelegates } from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { Measure } from "@/components/providers/music/types";
import { getHTMLCanvas } from "@/utils/music-rendering";

type MusicDisplayProps = {
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
  measures: Measure[];
};

const MusicDisplay: FunctionComponent<MusicDisplayProps> = ({
  aspectRatio,
  propDelegates,
  measures,
}) => {
  const dimensions = MusicLayout.getMarginlessSheetMusic(aspectRatio);
  // useMemo(() => {
  //   return MusicLayout.getMarginlessSheetMusic(aspectRatio);
  // }, [aspectRatio]);
  return getHTMLCanvas(aspectRatio, measures, dimensions, propDelegates);
};

export default MusicDisplay;
