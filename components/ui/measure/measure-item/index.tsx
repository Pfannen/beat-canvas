import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";

type MeasureItemProps = {
  bottom: string;
  left: string;
  height: string;
  children: ReactNode;
};

export type MeasureItemContainerProps = Omit<MeasureItemProps, "children">;

const MeasureItem: FunctionComponent<MeasureItemProps> = ({
  bottom,
  left,
  height,
  children,
}) => {
  return (
    <div style={{ bottom, left, height }} className={classes.measure_item}>
      {children}
    </div>
  );
};

export default MeasureItem;
