import { UnitMeasurement } from "@/types";
import { IDrawingCanvas } from "@/types/music-rendering/canvas";
import { PolymorphicComponentProps } from "@/types/polymorphic";
import {
  ComponentProps,
  ElementType,
  FunctionComponent,
  ReactElement,
} from "react";
import { CoordinateStyleCreator, StyleCreator } from "./utils";
import {
  HTMLCircleOptions,
  HTMLDrawOptions,
  HTMLEllipseOptions,
  HTMLLineOptions,
  HTMLRectangleOptions,
  HTMLSVGOptions,
} from "@/types/music-rendering/canvas/html";
import { concatClassNames } from "@/utils/css";

export class ReactDrawingCanvas implements IDrawingCanvas {
  private unit: UnitMeasurement;
  private components: ReactElement[] = [];
  constructor(unit: UnitMeasurement) {
    this.unit = unit;
  }

  private static attachDrawOptions(
    options: Partial<HTMLDrawOptions> | undefined,
    style: StyleCreator
  ) {
    if (options) {
      style.addOpacity(options.opacity === undefined ? 1 : 0);
      if (options.degreeRotation) style.addRotation(options.degreeRotation);
      if (options.cursor) style.addCursor(options.cursor);
    }
    style.addBackgroundColor(options?.color || "black");
  }

  private createStyledElement(
    styles: StyleCreator,
    props: ComponentProps<"div">
  ) {
    const { style, classNames } = styles.getStyle();
    const className = concatClassNames(...classNames, props.className);
    this.drawElement({
      ...props,
      style,
      className,
    });
  }

  drawElement(props: ComponentProps<"div">) {
    this.components.push(<div {...props} />);
  }

  drawLine(options: HTMLLineOptions): void {
    throw new Error("Method not implemented.");
  }

  drawCircle(options: HTMLCircleOptions): void {
    throw new Error("Method not implemented.");
  }

  drawRectangle({
    corner,
    width,
    height,
    drawOptions,
    props,
  }: HTMLRectangleOptions): void {
    const styleCreator = new CoordinateStyleCreator(
      corner,
      width,
      height,
      this.unit
    );
    ReactDrawingCanvas.attachDrawOptions(drawOptions, styleCreator.styles);
    this.createStyledElement(styleCreator.styles, props);
  }

  drawEllipse({
    aspectRatio,
    diameter,
    center,
    drawOptions,
    props,
  }: HTMLEllipseOptions): void {
    const width = aspectRatio * diameter;
    const styleCreator = new CoordinateStyleCreator(
      center,
      width,
      diameter,
      this.unit
    );
    styleCreator.styles.center();
    ReactDrawingCanvas.attachDrawOptions(drawOptions, styleCreator.styles);
    styleCreator.styles.addBorderRadius("50%");
    this.createStyledElement(styleCreator.styles, props);
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
