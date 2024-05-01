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
  "Times New Roman": { font: StandardFonts.TimesRoman, isFileName: false },
  Sonata: { font: "sonata.ttf", isFileName: true },
};

export const getPDFLibFontFamily = (font: DrawingCanvasFontFamily) =>
  pdfLibFontFamilies[font];

const cssFontFamilies: Record<DrawingCanvasFontFamily, string> = {
  "Times New Roman": "--times-new-roman",
  Sonata: "--font-sonata",
};

export const getCSSFontFamily = (font: DrawingCanvasFontFamily) =>
  cssFontFamilies[font];
