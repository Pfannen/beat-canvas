import { UnitMeasurement } from "@/types";
import {
  CircleOptions,
  IDrawingCanvas,
  LineOptions,
  RectangleOptions,
  SVGOptions,
  drawEllipseOptions,
} from "@/types/music-rendering/canvas";
import { PolymorphicComponentProps } from "@/types/polymorphic";
import { ElementType, ReactElement } from "react";
import { CoordinateStyleCreator } from "./utils";

export class ReactDrawingCanvas implements IDrawingCanvas {
  private unit: UnitMeasurement;
  private components: ReactElement[] = [];
  constructor(unit: UnitMeasurement) {
    this.unit = unit;
  }

  drawElement<C extends ElementType = "div">({
    as,
    ...restProps
  }: PolymorphicComponentProps<C>) {
    const C = as || "div";
    this.components.push(<C {...restProps} />);
  }

  drawLine(options: LineOptions): void {
    throw new Error("Method not implemented.");
  }

  drawCircle(options: CircleOptions): void {
    throw new Error("Method not implemented.");
  }

  drawRectangle(options: RectangleOptions): void {
    const styleCreator = new CoordinateStyleCreator(
      options.corner,
      options.width,
      options.height,
      this.unit
    );
    styleCreator.styles.addBackgroundColor("black");
    this.drawElement({ style: styleCreator.styles.getStyle() });
  }

  drawEllipse(options: drawEllipseOptions): void {
    const width = options.aspectRatio * options.diameter;
    const styleCreator = new CoordinateStyleCreator(
      options.center,
      width,
      options.diameter,
      this.unit
    );
    styleCreator.styles.center();
    styleCreator.styles.addBackgroundColor("black");
    if (options.degreeRotation)
      styleCreator.styles.addRotation(options.degreeRotation);
    this.drawElement({ style: styleCreator.styles.getStyle() });
  }

  drawSVG(options: SVGOptions): void {
    throw new Error("Method not implemented.");
  }

  createCanvas<C extends ElementType = "div">({
    as,
    ...restProps
  }: PolymorphicComponentProps<C>) {
    const C = as || "div";
    return <C {...restProps}>{this.components}</C>;
  }
}
