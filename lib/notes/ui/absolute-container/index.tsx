import { PolymorphicComponentProps } from "@/types/polymorphic";
import classes from "./index.module.css";
import { ElementType } from "react";
import { AxisProps } from "../../types";

type AbsoluteContainerProps = {
  yPercent: string;
  xPercent: string;
} & AxisProps;

const AbsoluteContainer = <C extends ElementType>({
  as,
  yAxis,
  yPercent,
  xAxis,
  xPercent,
  style,
  ...restProps
}: PolymorphicComponentProps<C, AbsoluteContainerProps>) => {
  const Component = as || "div";
  return (
    <Component
      style={{
        [yAxis]: yPercent,
        [xAxis]: xPercent,
        position: "absolute",
        ...style,
      }}
      {...restProps}
    />
  );
};

export default AbsoluteContainer;
