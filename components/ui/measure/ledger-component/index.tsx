import { PolymorphicComponentProps } from "@/types/polymorphic";
import { concatClassNames } from "@/utils/css";
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
  className,
  ...restProps
}: PolymorphicComponentProps<C, LedgerComponentProps>) => {
  const Component = as || "div";
  console.log(restProps.children);
  return (
    <Component
      {...restProps}
      data-is-line={isLine}
      className={concatClassNames(classes.component, className)}
      style={{ height }}
    >
      {restProps.children &&
        // <span className={classes.note}>{restProps.children}</span>
        restProps.children}
    </Component>
  );
};

export default LedgerComponent;
