import { ComponentPercentages } from "@/objects/note-position";
import LedgerComponent from "../../ledger-component";
import Segment from "../../segment";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import { numToPercent } from "@/utils";

type DisplayMeasureProps = {
  componentsAbove?: number;
  componentsBelow?: number;
  notesComponents?: ReactNode;
  componentPercentages?: ComponentPercentages;
  height: string;
  padding: string;
};

const DisplayMeasure: FunctionComponent<DisplayMeasureProps> = ({
  componentsAbove,
  componentsBelow,
  notesComponents,
  componentPercentages,
  height,
  padding,
}) => {
  const componentRenderer: LedgerComponentRenderer = (
    _,
    isLine,
    lineHeight,
    spaceHeight
  ) => {
    return (
      <LedgerComponent
        height={isLine ? numToPercent(lineHeight) : numToPercent(spaceHeight)}
        isLine={isLine}
      />
    );
  };
  return (
    <div
      style={{ "--body-height": height, "--padding": padding } as CSSProperties}
      className={classes.container}
    >
      <Segment
        width={"100%"}
        belowBody={componentsBelow}
        aboveBody={componentsAbove}
        renderLedgerComponent={componentRenderer}
        startWithLine
        body={7}
        className={classes.body}
        componentPercentages={componentPercentages}
      />
      {notesComponents}
    </div>
  );
};

export default DisplayMeasure;
