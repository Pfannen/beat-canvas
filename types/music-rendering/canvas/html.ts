import { PolymorphicComponentProps } from "@/types/polymorphic";
import { CSSProperties, ElementType } from "react";
import {
  CircleOptions,
  DrawOptions,
  EllipseOptions,
  LineOptions,
  RectangleOptions,
  SVGOptions,
} from ".";

export type HTMLDrawOptions = DrawOptions & { cursor: CSSProperties["cursor"] };

export type HTMLOptions<T, C extends ElementType> = Omit<
  PolymorphicComponentProps<C, T & { drawOptions?: Partial<HTMLDrawOptions> }>,
  "style"
>;

export type HTMLLineOptions<C extends ElementType> = HTMLOptions<
  LineOptions,
  C
>;

export type HTMLRectangleOptions<C extends ElementType> = HTMLOptions<
  RectangleOptions,
  C
>;

export type HTMLCircleOptions<C extends ElementType> = HTMLOptions<
  CircleOptions,
  C
>;

export type HTMLEllipseOptions<C extends ElementType> = HTMLOptions<
  EllipseOptions,
  C
>;

export type HTMLSVGOptions = SVGOptions;
