import { TimeSignature } from "@/components/providers/music/types";
import { SVGData } from "@/types/svg";

const timeSignatureNumbers: Record<number, SVGData> = {
  4: {
    path: "M0,49.81v-5.45l2.26-2.69,2.62-3.04,2.9-3.4,1.84-4.67,2.41-6.08,2.12-6.08,1.91-8.07,1.06-5.94.5-4.17,23.63-.21-.14,2.97-2.55,3.96-3.47,4.95-3.54,4.67-4.39,5.73-4.46,5.52-6.37,6.65-8.99,8.7v1.27l19.24-.21.07-12.66,15.28-15.56,1.13-.07v28.09l6.86-.14v6.08l-7.07.21-.07,3.11.42,2.83,1.13,3.25,1.98,1.77,1.98.57,1.91.5-.07,4.74-31.2.07-.14-4.74,2.41-.21,1.63-.42,2.12-1.41.78-1.56.64-2.62.21-3.18-.07-2.83-26.53-.21Z",
    viewBox: [0, 0, 50.23, 67],
  },
};

export const getTimeSignatureSVGs = (timeSignature: TimeSignature) => {
  return {
    beatNote: timeSignatureNumbers[4],
    beatsPerMeasure: timeSignatureNumbers[4],
  };
};
