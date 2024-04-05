import { PolymorphicComponentProps } from "@/types/polymorphic";
import { ElementType } from "react";
import {
  CircleOptions,
  EllipseOptions,
  LineOptions,
  RectangleOptions,
  SVGOptions,
} from ".";

export type HTMLDrawOptions<
  T,
  C extends ElementType
> = PolymorphicComponentProps<C, T>;

export type HTMLLineOptions<C extends ElementType> = HTMLDrawOptions<
  LineOptions,
  C
>;

export type HTMLRectangleOptions<C extends ElementType> = HTMLDrawOptions<
  RectangleOptions,
  C
>;

export type HTMLCircleOptions<C extends ElementType> = HTMLDrawOptions<
  CircleOptions,
  C
>;

export type HTMLEllipseOptions<C extends ElementType> = HTMLDrawOptions<
  EllipseOptions,
  C
>;

export type HTMLSVGOptions = HTMLDrawOptions<SVGOptions, "svg">;
