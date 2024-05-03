export type ViewBox = [number, number, number, number];

export type SVGData = { paths: string[]; viewBox: ViewBox };

export type SVGRecord<T extends string> = Record<T, SVGData>;

export type SVGMetadata = SVGData & {
  centerFractionOffsetY: number;
}; //The offset from the center of the SVG to the "actual" center
