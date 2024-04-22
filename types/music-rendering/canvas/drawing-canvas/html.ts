import { CSSProperties, ElementType } from "react";
import {
  CircleDrawOptions,
  DrawOptions,
  EllipseDrawOptions,
  LineDrawOptions,
  RectangleDrawOptions,
  SVGDrawOptions,
} from ".";
import { OmittedComponentProps } from "@/types/polymorphic";

export type HTMLDrawOptions = DrawOptions<ExtraDrawOptions>;

export type ExtraDrawOptions = { cursor: CSSProperties["cursor"] };

export type HTMLOptions<T, C extends ElementType> = T & {
  props: OmittedComponentProps<C, T>;
};

export type HTMLLineOptions = HTMLOptions<
  LineDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLRectangleOptions = HTMLOptions<
  RectangleDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLCircleOptions = HTMLOptions<
  CircleDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLEllipseOptions = HTMLOptions<
  EllipseDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLSVGOptions = SVGDrawOptions & {
  height: number;
  width: number;
};

export type DimensionDirection = "positive" | "negative";

export type DimensionDirections = {
  x: DimensionDirection;
  y: DimensionDirection;
};
