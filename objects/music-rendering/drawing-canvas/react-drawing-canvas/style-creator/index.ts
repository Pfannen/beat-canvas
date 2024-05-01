import classes from "./index.module.css";
import { Coordinate } from "@/types";
import { UnitMeasurement } from "@/types";
import { DrawingCanvasFontFamily } from "@/types/music-rendering/canvas/drawing-canvas";
import { DimensionDirections } from "@/types/music-rendering/canvas/drawing-canvas/html";
import { appendUnit } from "@/utils";
import { getCSSFontFamily } from "@/utils/fonts/score-drawer";
import { CSSProperties } from "react";

type Style = { [key: string]: string | undefined | number };

const variablePrefix = "--style-c";

export class StyleCreator {
  private cssVariables: Style = {};
  private classNames: string[] = [];
  private unit: UnitMeasurement;

  constructor(unit: UnitMeasurement) {
    this.unit = unit;
  }

  private addVariable(key: string, value: Style[""]) {
    this.cssVariables[`${variablePrefix}-${key}`] = value;
  }

  private addClassName(className: string) {
    this.classNames.push(classes[className]);
  }

  private addDefinedVariable(variable: string, value: string) {
    this.cssVariables[variable] = value;
  }

  private addVariableAndClass(key: string, value: Style[""]) {
    this.addVariable(key, value);
    this.addClassName(key);
  }

  private applyUnitToCoord(coord: Coordinate) {
    return { x: this.applyUnit(coord.x), y: this.applyUnit(coord.y) };
  }

  private applyUnit(value: number) {
    return value + this.unit;
  }

  public addDimensions = (width: number, height: number) => {
    this.addVariable("width", this.applyUnit(width));
    this.addVariable("height", this.applyUnit(height));
    this.addClassName("dim");
  };

  public addCoordinate = (coordinate: Coordinate) => {
    const coord = this.applyUnitToCoord(coordinate);
    this.addVariable("left", coord.x);
    this.addVariable("bottom", coord.y);
    this.addClassName("placement");
  };

  public center() {
    this.addClassName("center");
  }

  public modifyTransformOrigin(directions: DimensionDirections) {
    let yTransform = directions.y === "positive" ? "bottom" : "top";
    let xTransform = directions.x === "positive" ? "left" : "right";
    this.addVariableAndClass("t-origin", `${yTransform} ${xTransform}`);
  }

  public addBorderRadius = (value: string) => {
    this.addVariableAndClass("border-radius", value);
  };

  public addBackgroundColor = (color: string) => {
    this.addVariableAndClass("bg-color", color);
  };

  public addRotation = (degree: number) => {
    this.addVariableAndClass("degree-rotation", `${degree}deg`);
  };

  public addPosition = (position: CSSProperties["position"]) => {
    this.addVariableAndClass("position", position);
  };

  public addOpacity = (opacity: number) => {
    this.addVariableAndClass("opacity", opacity);
  };

  public addCursor = (cursor: CSSProperties["cursor"]) => {
    this.addVariableAndClass("cursor", cursor);
  };

  public addScale = (scale: number) => {
    this.addVariableAndClass("scale", scale);
  };

  public addReferencePoint = (
    point: "top" | "bottom" | "left" | "right",
    value: number
  ) => {
    this.addVariableAndClass(point, appendUnit(value, this.unit));
  };

  public addFontFamily = (fontFamily: DrawingCanvasFontFamily) => {
    const variableName = getCSSFontFamily(fontFamily);
    this.addVariableAndClass("font-family", variableName);
  };

  public addFontSize = (fontSize: string) => {
    this.addVariableAndClass("font-size", fontSize);
  };

  public centerOnAxis = (axis: "x" | "y") => {
    axis === "x"
      ? this.addClassName("center-x")
      : this.addClassName("center-y");
  };

  public addPointerEvent = (event: CSSProperties["pointerEvents"]) => {
    this.addVariableAndClass("pointer", event);
  };

  public getStyle = () => {
    return {
      style: this.cssVariables as CSSProperties,
      classNames: this.classNames,
    };
  };

  public clearStyle = () => {
    this.cssVariables = {};
    this.classNames = [];
  };
}
