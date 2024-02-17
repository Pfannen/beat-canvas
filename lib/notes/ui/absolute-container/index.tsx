import { PolymorphicComponentProps } from "@/types/polymorphic";
import classes from "./index.module.css";
import { ElementType } from "react";
import { AxisProps, XAxis, YAxis } from "../../types";

type Props = {
  yPercent?: string;
  xPercent?: string;
  centerX?: boolean;
  centerY?: boolean;
} & AxisProps;

export type AbsoluteContainerProps<
  C extends ElementType,
  P = {}
> = PolymorphicComponentProps<C, P & Props>;

const AbsoluteContainer = <C extends ElementType>({
  as,
  yAxis,
  yPercent,
  xAxis,
  xPercent,
  centerX,
  centerY,
  style,
  ...restProps
}: AbsoluteContainerProps<C>) => {
  const Component = as || "div";
  xPercent = xPercent || (centerX ? "50%" : "0%"); //If xPercent is defined, leave it as is else use the translateX value (typically if centerX is specified then xPercent won't be specified but if no xPercent defined and no centerX there will be no effect)
  yPercent = yPercent || (centerY ? "50%" : "0%");
  const translateX = centerX ? getXCenter(xAxis) : "0%"; //If centerX then get the correct translate amount for the x-axis
  const translateY = centerY ? getYCenter(yAxis) : "0%";
  const transform = `translate(${translateX}, ${translateY})`;

  return (
    <Component
      style={{
        [yAxis]: yPercent,
        [xAxis]: xPercent,
        position: "absolute",
        transform,
        ...style,
      }}
      {...restProps}
    />
  );
};

export default AbsoluteContainer;

const getXCenter = (xAxis: XAxis) => {
  if (xAxis === "left") return "-50%";
  return "50%";
};

const getYCenter = (yAxis: YAxis) => {
  if (yAxis === "top") return "-50%";
  return "50%";
};
