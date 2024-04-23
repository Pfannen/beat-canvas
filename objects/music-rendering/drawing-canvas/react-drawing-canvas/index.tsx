import { UnitMeasurement } from "@/types";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { PolymorphicComponentProps } from "@/types/polymorphic";
import {
  ComponentProps,
  ElementType,
  FunctionComponent,
  ReactElement,
} from "react";
import { CoordinateStyleCreator } from "./utils";
import {
  HTMLDrawOptions,
  HTMLEllipseOptions,
  HTMLRectangleOptions,
  HTMLSVGOptions,
} from "@/types/music-rendering/canvas/drawing-canvas/html";
import { concatClassNames } from "@/utils/css";
import { StyleCreator } from "./style-creator";
import { getSVGHeight } from "@/utils/svg";

export class ReactDrawingCanvas implements IDrawingCanvas {
  private unit: UnitMeasurement;
  private components: ReactElement[] = [];
  constructor(unit: UnitMeasurement) {
    this.unit = unit;
  }

  private static attachDrawOptions(
    options: Partial<HTMLDrawOptions> | undefined,
    style: StyleCreator,
    defaultColor = "black"
  ) {
    if (options) {
      style.addOpacity(options.opacity === undefined ? 1 : 0);
      if (options.degreeRotation) style.addRotation(options.degreeRotation);
      if (options.cursor) style.addCursor(options.cursor);
    }
    style.addBackgroundColor(options?.color || defaultColor);
  }

  private static extractStyleData(styles: StyleCreator, className?: string) {
    const { style, classNames } = styles.getStyle();
    const classN = concatClassNames(...classNames, className);
    return { style, className: classN };
  }

  private createStyledElement(
    styles: StyleCreator,
    props: ComponentProps<"div">
  ) {
    const { style, className } = ReactDrawingCanvas.extractStyleData(
      styles,
      props?.className
    );
    this.drawElement({
      ...props,
      style: { ...style, ...props?.style },
      className,
    });
  }

  drawElement(props: ComponentProps<"div">) {
    this.components.push(<div {...props} />);
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
    ReactDrawingCanvas.attachDrawOptions(drawOptions, styleCreator);
    this.createStyledElement(styleCreator, props);
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
    styleCreator.center();
    ReactDrawingCanvas.attachDrawOptions(drawOptions, styleCreator);
    styleCreator.addBorderRadius("50%");
    this.createStyledElement(styleCreator, props);
  }

  drawSVG(options: HTMLSVGOptions): void {
    const scale = options.scale || 1;
    const height = getSVGHeight(options.viewBox);
    let x = options.x;
    let y = options.y;

    //Height is passed for the width because it seems that if width >= height, the scaling factor works correctly
    const styleCreator = new CoordinateStyleCreator(
      { x, y },
      height,
      height,
      this.unit
    );

    styleCreator.addScale(scale);
    if (options.center) {
      styleCreator.center();
    }

    ReactDrawingCanvas.attachDrawOptions(
      options.drawOptions,
      styleCreator,
      "transparent"
    );
    const { style, className } =
      ReactDrawingCanvas.extractStyleData(styleCreator);
    const component = (
      <svg
        viewBox={options.viewBox.join(" ")}
        style={style}
        className={className}
      >
        <path d={options.path} />
      </svg>
    );
    this.components.push(component);
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
        {restProps.children}
      </C>
    );
  }
}
