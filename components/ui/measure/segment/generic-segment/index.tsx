import Segment from "..";
import LedgerComponent from "../../ledger-component";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type GenericSegmentProps = {
  lineHeight: number;
  spaceHeight: number;
  heightUnit: "px" | "%";
  linesAbove?: number;
  spacesAbove?: number;
  linesBelow?: number;
  spacesBelow?: number;
};

const GenericSegment: FunctionComponent<GenericSegmentProps> = ({
  lineHeight,
  spaceHeight,
  heightUnit,
  linesAbove = 0,
  spacesAbove = 0,
  linesBelow = 0,
  spacesBelow = 0,
}) => {
  const componentRenderer: LedgerComponentRenderer = (y, isLine) => {
    return (
      <LedgerComponent
        height={isLine ? lineHeight + heightUnit : spaceHeight + heightUnit}
        isLine={isLine}
      />
    );
  };
  const paddingTop =
    linesAbove * lineHeight + spacesAbove * spaceHeight + heightUnit;
  const paddingBottom =
    linesBelow * lineHeight + spacesBelow * spaceHeight + heightUnit;
  return (
    <span style={{ paddingTop, paddingBottom }}>
      <Segment
        width={1}
        belowBody={0}
        aboveBody={0}
        renderLedgerComponent={componentRenderer}
      />
    </span>
  );
};

export default GenericSegment;
