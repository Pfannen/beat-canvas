import { RelativeClickableBeatCanvas } from "@/objects/music-rendering/beat-canvas/relative-clickable-beat-canvas";
import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { Music } from "@/objects/music/readonly-music";
import { FunctionComponent } from "react";
import { useMusic } from "@/components/providers/music";
import {
  BeatCanvasPropDelegates,
  PropDelegates,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";

type MusicDisplayProps = {
  aspectRatio: number;
  propDelegates?: BeatCanvasPropDelegates;
};

const MusicDisplay: FunctionComponent<MusicDisplayProps> = ({
  aspectRatio,
  propDelegates,
}) => {
  const { measures } = useMusic();
  const music = new Music();
  music.setMeasures(measures);
  return getHTMLCanvas(aspectRatio, music, propDelegates);
};

export default MusicDisplay;

export const getHTMLCanvas = (
  aspectRatio: number,
  music: Music,
  delegates?: Partial<PropDelegates>
) => {
  const drawingCanvas = new ReactDrawingCanvas("%");
  const converter = (xValue: number) => xValue / aspectRatio;
  const beatCanvas = new RelativeClickableBeatCanvas(
    converter,
    drawingCanvas,
    delegates
  );
  const dimensions = MusicLayout.getHomePageDimensions(aspectRatio);
  const renderer = new MeasureRenderer(music, 6, dimensions, () => beatCanvas);
  renderer.render();
  return beatCanvas.createCanvas({
    style: { position: "relative", width: "100%", height: "100%" },
  });
};
