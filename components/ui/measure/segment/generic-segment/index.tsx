import Segment from "..";
import LedgerComponent from "../../ledger-component";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type GenericSegmentProps = {
  lineHeight: string;
  spaceHeight: string;
};

const GenericSegment: FunctionComponent<GenericSegmentProps> = ({
  lineHeight,
  spaceHeight,
}) => {
  const componentRenderer: LedgerComponentRenderer = (y, isLine) => {
    return (
      <LedgerComponent
        height={isLine ? lineHeight : spaceHeight}
        isLine={isLine}
      />
    );
  };
  return (
    <Segment
      width={1}
      belowBody={0}
      aboveBody={0}
      renderLedgerComponent={componentRenderer}
    />
  );
};

export default GenericSegment;
