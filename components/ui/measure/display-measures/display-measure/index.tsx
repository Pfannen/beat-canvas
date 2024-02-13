import { ComponentPercentages } from "@/objects/note-position";
import LedgerComponent from "../../ledger-component";
import Segment from "../../segment";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import { numToPercent } from "@/utils";
import { ComponentProps } from "@/types/polymorphic";
import { concatClassNames } from "@/utils/css";

type DisplayMeasureProps = {
  componentsAbove?: number;
  componentsBelow?: number;
  notesComponents?: ReactNode;
  componentPercentages?: ComponentPercentages;
  height: string;
  padding: string;
} & ComponentProps<"div">;

const DisplayMeasure: FunctionComponent<DisplayMeasureProps> = ({
  componentsAbove,
  componentsBelow,
  notesComponents,
  componentPercentages,
  height,
  padding,
  className,
  ...restProps
}) => {
  const componentRenderer: LedgerComponentRenderer = (
    y,
    isLine,
    lineHeight,
    spaceHeight
  ) => {
    return (
      <LedgerComponent
        height={isLine ? numToPercent(lineHeight) : numToPercent(spaceHeight)}
        isLine={isLine}
        className={classes.component}
        key={y}
      />
    );
  };
  return (
    <div
      style={{ "--body-height": height, "--padding": padding } as CSSProperties}
      className={concatClassNames(classes.container, className)}
      {...restProps}
    >
      <Segment
        width={"100%"}
        belowBody={componentsBelow}
        aboveBody={componentsAbove}
        renderLedgerComponent={componentRenderer}
        startWithLine
        body={7}
        componentPercentages={componentPercentages}
      />
      {notesComponents}
    </div>
  );
};

export default DisplayMeasure;
