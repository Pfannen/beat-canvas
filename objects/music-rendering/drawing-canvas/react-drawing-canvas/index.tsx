import { UnitMeasurement } from "@/types";
import { IDrawingCanvas } from "@/types/music-rendering/canvas";
import { PolymorphicComponentProps } from "@/types/polymorphic";
import { ElementType, FunctionComponent, ReactElement } from "react";
import { CoordinateStyleCreator } from "./utils";
import {
  HTMLCircleOptions,
  HTMLEllipseOptions,
  HTMLLineOptions,
  HTMLRectangleOptions,
  HTMLSVGOptions,
} from "@/types/music-rendering/canvas/html";

export class ReactDrawingCanvas implements IDrawingCanvas {
  private unit: UnitMeasurement;
  private components: ReactElement[] = [];
  constructor(unit: UnitMeasurement) {
    this.unit = unit;
  }

  drawElement<C extends ElementType>({
    as,
    ...restProps
  }: PolymorphicComponentProps<C>) {
    const C = as || "div";
    this.components.push(<C {...restProps} />);
  }

  drawLine<C extends ElementType = "div">(options: HTMLLineOptions<C>): void {
    throw new Error("Method not implemented.");
  }

  drawCircle<C extends ElementType = "div">(
    options: HTMLCircleOptions<C>
  ): void {
    throw new Error("Method not implemented.");
  }

  drawRectangle<C extends ElementType = "div">({
    corner,
    width,
    height,
    degreeRotation,
    ...restProps
  }: HTMLRectangleOptions<C>): void {
    const styleCreator = new CoordinateStyleCreator(
      corner,
      width,
      height,
      this.unit
    );
    styleCreator.styles.addBackgroundColor("black");
    if (degreeRotation) styleCreator.styles.addRotation(degreeRotation);
    this.drawElement<any>({
      ...restProps,
      style: styleCreator.styles.getStyle(),
    });
  }

  drawEllipse<C extends ElementType = "div">({
    aspectRatio,
    diameter,
    center,
    degreeRotation,
    ...restProps
  }: HTMLEllipseOptions<C>): void {
    const width = aspectRatio * diameter;
    const styleCreator = new CoordinateStyleCreator(
      center,
      width,
      diameter,
      this.unit
    );
    styleCreator.styles.center();
    styleCreator.styles.addBackgroundColor("black");
    if (degreeRotation) styleCreator.styles.addRotation(degreeRotation);
    styleCreator.styles.addBorderRadius("50%");
    this.drawElement<any>({ ...restProps, style: styleCreator.getStyle() });
  }

  drawSVG(options: HTMLSVGOptions): void {
    throw new Error("Method not implemented.");
  }

  getComponents(): FunctionComponent {
    return () => this.components;
  }

  createCanvas<C extends ElementType = "div">({
    as,
    ...restProps
  }: PolymorphicComponentProps<C>) {
    const C = as || "div";
    const MeasureComponents = this.getComponents();
    return (
      <C {...restProps}>
        <MeasureComponents />
      </C>
    );
  }
}
