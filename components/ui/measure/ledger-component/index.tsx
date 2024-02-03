import { PolymorphicComponentProps } from "@/types/polymorphic";
import classes from "./index.module.css";
import { ElementType } from "react";

type LedgerComponentProps = {
  height: string;
  isLine: boolean;
};

const LedgerComponent = <C extends ElementType = "div">({
  as,
  height,
  isLine,
  ...restProps
}: PolymorphicComponentProps<C, LedgerComponentProps>) => {
  const Component = as || "div";
  return (
    <Component
      {...restProps}
      className={`${classes.component} ${isLine && classes.line}`}
      style={{ height }}
    />
  );
};

export default LedgerComponent;
