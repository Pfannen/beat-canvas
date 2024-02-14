import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import ControlBtn from "./control-button";
import { ComponentProps } from "@/types/polymorphic";

export type ControlButton = {
  label: ReactNode;
  buttonProps: ComponentProps<"button">;
};

type ControlButtonsProps = {
  buttons: ControlButton[];
};

const ControlButtons: FunctionComponent<ControlButtonsProps> = ({
  buttons,
}) => {
  return (
    <ul className={classes.buttons}>
      {buttons.map(({ label, buttonProps }, i) => {
        return (
          <li>
            <ControlBtn {...buttonProps} key={i}>
              {label}
            </ControlBtn>
          </li>
        );
      })}
    </ul>
  );
};

export default ControlButtons;
