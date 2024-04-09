import { Coordinate } from "@/objects/measurement/types";
import { UnitMeasurement } from "@/types";
import { StyleCreator } from "./style-creator";
import { DimensionDirections } from "@/types/music-rendering/canvas/html";

export class CoordinateStyleCreator {
  private coordinate: Coordinate;
  private xAxisValue: number;
  private yAxisValue: number;
  public styles: StyleCreator;

  private adjustedCoordinate!: Coordinate;
  private adjustedXValue!: number;
  private adjustedYValue!: number;
  constructor(
    coordinate: Coordinate,
    xAxisValue: number,
    yAxisValue: number,
    unit: UnitMeasurement
  ) {
    this.coordinate = coordinate;
    this.xAxisValue = xAxisValue;
    this.yAxisValue = yAxisValue;
    this.styles = new StyleCreator(unit);
    this.adjustPosition();
    this.styles.addCoordinate(this.adjustedCoordinate);
    this.styles.addDimensions(this.adjustedXValue, this.adjustedYValue);
    this.styles.modifyTransformOrigin(
      this.getDirectionData(xAxisValue, yAxisValue)
    );
    this.styles.addPosition("absolute");
  }

  private getDirectionData(
    xAxisValue: number,
    yAxisValue: number
  ): DimensionDirections {
    const x = xAxisValue < 0 ? "negative" : "positive";
    const y = yAxisValue < 0 ? "negative" : "positive";
    return { x, y };
  }

  private adjustPosition() {
    this.adjustedCoordinate = { ...this.coordinate };
    this.adjustedXValue = this.xAxisValue;
    this.adjustedYValue = this.yAxisValue;
    if (this.xAxisValue < 0) {
      this.adjustedCoordinate.x += this.xAxisValue;
      this.adjustedXValue *= -1;
    }
    if (this.yAxisValue < 0) {
      this.adjustedCoordinate.y += this.yAxisValue;
      this.adjustedYValue *= -1;
    }
  }

  public getStyle() {
    return this.styles.getStyle();
  }
}
