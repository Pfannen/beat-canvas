import { Coordinate } from "@/objects/measurement/types";
import { UnitMeasurement } from "@/types";
import { StyleCreator } from "./style-creator";
import { DimensionDirections } from "@/types/music-rendering/canvas/html";

export class CoordinateStyleCreator extends StyleCreator {
  constructor(
    coordinate: Coordinate,
    xAxisValue: number,
    yAxisValue: number,
    unit: UnitMeasurement
  ) {
    super(unit);
    const values = CoordinateStyleCreator.adjustPosition(
      coordinate,
      xAxisValue,
      yAxisValue
    );
    this.addCoordinate(values.adjustedCoordinate);
    this.addDimensions(values.adjustedXValue, values.adjustedYValue);
    this.modifyTransformOrigin(this.getDirectionData(xAxisValue, yAxisValue));
    this.addPosition("absolute");
    console.log(coordinate);
  }

  private getDirectionData(
    xAxisValue: number,
    yAxisValue: number
  ): DimensionDirections {
    const x = xAxisValue < 0 ? "negative" : "positive";
    const y = yAxisValue < 0 ? "negative" : "positive";
    return { x, y };
  }

  private static adjustPosition(
    coordinate: Coordinate,
    xAxisValue: number,
    yAxisValue: number
  ) {
    const adjustedCoordinate = { ...coordinate };
    let adjustedXValue = xAxisValue;
    let adjustedYValue = yAxisValue;
    if (xAxisValue < 0) {
      adjustedCoordinate.x += xAxisValue;
      adjustedXValue *= -1;
    }
    if (yAxisValue < 0) {
      adjustedCoordinate.y += yAxisValue;
      adjustedYValue *= -1;
    }
    return { adjustedCoordinate, adjustedXValue, adjustedYValue };
  }
}
