import { UnitConverter, UnitMeasurement } from "@/types";
import {
  IDrawingCanvas,
  TextDrawOptions,
} from "@/types/music-rendering/canvas/drawing-canvas";
import { PolymorphicComponentProps } from "@/types/polymorphic";
import {
  ComponentProps,
  ElementType,
  FunctionComponent,
  ReactElement,
} from "react";
import { CoordinateStyleCreator } from "./style-creator/coordinate";
import {
  HTMLDrawOptions,
  HTMLEllipseOptions,
  HTMLRectangleOptions,
  HTMLSVGOptions,
} from "@/types/music-rendering/canvas/drawing-canvas/html";
import { concatClassNames } from "@/utils/css";
import { StyleCreator } from "./style-creator";
import { getSVGHeight, getSVGWidth } from "@/utils/svg";
import { getRedundantConverter } from "@/utils/music-rendering";
import { appendPosition } from "./style-creator/utils";

export class ReactDrawingCanvas implements IDrawingCanvas {
  private unit: UnitMeasurement;
  private svgWidthConverter: UnitConverter<number, number>;
  private components: ReactElement[] = [];
  constructor(
    unit: UnitMeasurement,
    svgWidthConverter?: UnitConverter<number, number>
  ) {
    this.unit = unit;
    this.svgWidthConverter = svgWidthConverter || getRedundantConverter();
  }

  private static attachDrawOptions(
    options: Partial<HTMLDrawOptions> | undefined,
    style: StyleCreator,
    defaultColor = "black"
  ) {
    if (options) {
      style.addOpacity(options.opacity === undefined ? 1 : options.opacity);
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

      this.unit,
      width,
      height
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

      this.unit,
      width,
      diameter
    );

    styleCreator.center();
    ReactDrawingCanvas.attachDrawOptions(drawOptions, styleCreator);
    styleCreator.addBorderRadius("50%");
    this.createStyledElement(styleCreator, props);
  }

  drawSVG(options: HTMLSVGOptions): void {
    const scale = options.scale || 1;
    const width = this.svgWidthConverter(getSVGWidth(options.viewBox));
    const height = getSVGHeight(options.viewBox);
    let x = options.x;
    let y = options.y;
    if (!options.center) {
      if (options.drawOptions?.degreeRotation) {
        y += height * scale;
      } else {
        y -= height * scale;
      }
    }

    //Height is passed for the width because it seems that if width >= height, the scaling factor works correctly
    const styleCreator = new CoordinateStyleCreator(
      { x, y },
      this.unit,
      width,
      height
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
        {options.paths.map((path) => (
          <path d={path} />
        ))}
      </svg>
    );
    this.components.push(component);
  }

  drawText(options: TextDrawOptions): void {
    const styleCreator = new CoordinateStyleCreator(
      { x: options.x, y: options.y },
      this.unit
    );
    options.position && appendPosition(options.position, styleCreator);
    styleCreator.addFontFamily(options.fontFamily);
    styleCreator.addFontSize(options.fontSize + options.fontUnit);
    styleCreator.addPointerEvent("none");
    const { className, style } =
      ReactDrawingCanvas.extractStyleData(styleCreator);
    this.components.push(
      <p className={className} style={style}>
        {options.text}
      </p>
    );
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
