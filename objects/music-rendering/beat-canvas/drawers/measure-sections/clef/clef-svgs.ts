import { Clef } from "@/types/music";
import { SVGData } from "@/types/svg";
import { getSVGAspectRatio } from "@/utils/svg";

const clefSVGData: Partial<Record<Clef, SVGData>> = {
  bass: {
    path: "M47.6,25.8c-1.6,0-4.3,0.2-5.9,0.7c-4.9,1.6-11.3,6.9-9.2,15.3c0.1,0.3,1,2,1.3,2.5c1.2,1.5,2.9,2.4,5,2.4    c3.5,0,6.3-2.8,6.3-6.3s-2.8-6.3-6.3-6.3c-1.4,0-2.6,0.4-3.7,1.2c0-0.2,1-4.1,4.7-6.4c1-0.6,4.8-2.6,8.4-0.9    c9.5,4.4,5.7,21.8,4.7,24.3c-1,2.5-4.6,13.2-23.9,21.8c-0.2,0.1,4.3-0.3,6.7-1.1c20.5-6.6,24.5-22,25.2-24.5    c0.7-2.5,1-6.4,0.8-8.5C61.4,35.8,58.2,26.1,47.6,25.8z",
    viewBox: [0, 0, 100, 125],
  },
};

export const getClefSVG = (clef: Clef) => {
  return clefSVGData[clef] || clefSVGData["bass"]!;
};

export const getClefAspectRatio = (clef: Clef) => {
  const { viewBox } = getClefSVG(clef);
  return getSVGAspectRatio(viewBox);
};
