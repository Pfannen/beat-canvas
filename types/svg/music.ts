import { SVGData, SVGMetadata } from ".";

export type ClefSVG = SVGMetadata & {
  fractionOfBodyHeight: number;
};

export type AccidentalSVG = SVGMetadata & { fractionOfSpaceHeight: number };

export type FlagSVG = SVGData & { stemMultiplier: number };
