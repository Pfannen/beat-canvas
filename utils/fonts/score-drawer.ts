import { DrawingCanvasFontFamily } from "@/types/music-rendering/canvas/drawing-canvas";
import { ScoreDrawerFont } from "@/types/music-rendering/canvas/score-drawer";
import { StandardFonts } from "pdf-lib";

export const deafultFonts: DrawingCanvasFontFamily[] = ["Sonata"];

const fontLocations = {
  Sonata: "/fonts/sonata.ttf",
};

export const pdfLibFontFamilies: Record<
  DrawingCanvasFontFamily,
  ScoreDrawerFont<StandardFonts>
> = {
  "Times New Roman": { font: StandardFonts.TimesRoman, isLocation: false },
  Sonata: { font: StandardFonts.HelveticaOblique, isLocation: false },
};
