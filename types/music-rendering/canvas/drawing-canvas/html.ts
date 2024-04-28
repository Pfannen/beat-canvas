import { CSSProperties, ElementType } from "react";
import {
  DrawOptions,
  EllipseDrawOptions,
  RectangleDrawOptions,
  SVGDrawOptions,
} from ".";
import { OmittedComponentProps } from "@/types/polymorphic";

export type HTMLDrawOptions = DrawOptions<ExtraDrawOptions>;

export type ExtraDrawOptions = { cursor: CSSProperties["cursor"] };

export type HTMLOptions<T, C extends ElementType> = T & {
  props: OmittedComponentProps<C, T>;
};

export type HTMLRectangleOptions = HTMLOptions<
  RectangleDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLEllipseOptions = HTMLOptions<
  EllipseDrawOptions<ExtraDrawOptions>,
  "div"
>;

export type HTMLSVGOptions = SVGDrawOptions;

export type DimensionDirection = "positive" | "negative";

export type DimensionDirections = {
  x: DimensionDirection;
  y: DimensionDirection;
};
