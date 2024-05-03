import { Accidental } from "@/types/music";
import { AccidentalSVG } from "@/types/svg/music";

const accidentalSVGData: Record<Accidental, AccidentalSVG> = {
  n: {
    paths: [
      "M26.58,106.17l-3.94,1.41v-32.2L0,85.22V1.69L3.8,0v32.77l22.78-10.41v83.81ZM22.64,61.17v-22.5L3.8,46.97v22.5l18.84-8.3Z",
    ],
    viewBox: [0, 0, 26.58, 107.58],
    centerFractionOffsetY: 0,
    fractionOfSpaceHeight: 3.5,
  },
  "#": {
    paths: [
      "M1.91,12.15v-4.7l2-.55v4.68l-2,.58ZM5.84,11.02l-1.38.39v-4.68l1.38-.38v-1.94l-1.38.38V0h-.56v4.93l-2,.57V.86h-.53v4.83l-1.38.39v1.95l1.38-.38v4.67l-1.38.38v1.94l1.38-.38v4.75h.53v-4.92l2-.55v4.63h.56v-4.8l1.38-.39v-1.95Z",
    ],
    viewBox: [0, 0, 5.84, 19],
    centerFractionOffsetY: 0,
    fractionOfSpaceHeight: 3.5,
  },
  b: {
    paths: [
      "M3.22,8.38c0,.57-.22,1.13-.81,1.86-.63.78-1.15,1.23-1.85,1.76v-3.43c.16-.4.39-.72.7-.97.31-.25.62-.37.94-.37.52,0,.85.3,1,.89.02.05.02.14.02.26ZM3.14,5.98c-.43,0-.87.12-1.32.36-.45.24-.87.56-1.27.95V.02h-.56v12.45c0,.35.1.53.29.53.11,0,.25-.09.46-.22.58-.35.95-.58,1.34-.83.45-.28.96-.61,1.63-1.25.46-.46.8-.93,1.01-1.41.21-.47.31-.94.31-1.41,0-.69-.18-1.18-.55-1.47-.41-.3-.86-.46-1.34-.46Z",
    ],
    viewBox: [0, 0, 5.03, 13],
    centerFractionOffsetY: -0.2,
    fractionOfSpaceHeight: 2.4,
  },
};

export const getAccidentalSVG = (accidental: Accidental) => {
  return accidentalSVGData[accidental];
};
