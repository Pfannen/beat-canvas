import { ComponentProps } from "@/types/polymorphic";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import { concatClassNames } from "@/utils/css";

type ControlButtonProps = {
  children: ReactNode;
};

const ControlButton: FunctionComponent<
  ComponentProps<"button", ControlButtonProps>
> = ({ children, className, ...restProps }) => {
  console.log(restProps);
  return (
    <button
      className={concatClassNames(classes.button, className)}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default ControlButton;
