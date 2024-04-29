import classes from "./index.module.css";
import { FunctionComponent } from "react";
import ControlBtn from "./control-button";
import { ControlButton } from "@/types/workspace";

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
