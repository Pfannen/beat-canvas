"use client";

import { Measure } from "@/components/providers/music/types";
import { ClickableBeatCanvas } from "@/objects/music-rendering/beat-canvas/clickable-beat-canvas";
import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { PageDimensionParams } from "@/objects/music-rendering/music-layout/page-dimension-params";
import { Music } from "@/objects/music/readonly-music";
import { IBeatCanvas } from "@/types/music-rendering/canvas/beat-canvas";

export const renderMeasures = (
  measures: Measure[],
  getBeatCanvasForPage: (pageNum: number) => IBeatCanvas
) => {
  const pageParams = PageDimensionParams.genericSheetMusic();
  const dimensions = MusicLayout.getDimensions(pageParams);
  const music = new Music();
  music.setMeasures(measures);
  const renderer = new MeasureRenderer(
    music,
    6,
    dimensions,
    getBeatCanvasForPage
  );
  renderer.render();
};

export const drawMockMeasures = (
  getBeatCanvasForPage: (pageNum: number) => IBeatCanvas
) => {
  renderMeasures(createMockMeasures(), getBeatCanvasForPage);
};

const notes = [];

export const getHTMLCanvas = () => {
  const onMeasureClick = (identifiers: any) => console.log(identifiers);
  const onComponentClick = (identifiers: any) => console.log(identifiers);
  // const onNoteClick = (identifiers: any) => ({onClick});
  const beatCanvas = new ClickableBeatCanvas(
    "px",
    undefined,
    undefined,
    (identifiers) => {
      return {
        onClick: () => {
          console.log(identifiers);
        },
      };
    }
  );
  drawMockMeasures(() => beatCanvas);
  return beatCanvas.createCanvas({
    style: { position: "relative", width: "595.28px", height: "841.89px" },
  });
};

const createMockMeasures = () => {
  const measures: Measure[] = [];
  const measureCount = 1;
  for (let i = 0; i < measureCount; i++) {
    measures.push({
      notes: [
        { x: 0, y: -1, type: "eighth" },
        { x: 0.5, y: 1, type: "eighth" },
        // { x: 1, y: 10, type: "quarter" },
        // { x: 2, y: -1, type: "eighth" },
        // { x: 2.5, y: -1, type: "eighth" },
        // { x: 3, y: -1, type: "eighth" },
        // { x: 3.5, y: -1, type: "eighth" },
      ],
    });
  }
  return measures;
};
