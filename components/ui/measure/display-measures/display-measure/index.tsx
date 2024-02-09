import LedgerComponent from "../../ledger-component";
import Segment from "../../segment";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";

type DisplayMeasureProps = {
  componentsAbove?: number;
  componentsBelow?: number;
  notesComponents?: ReactNode;
};

const DisplayMeasure: FunctionComponent<DisplayMeasureProps> = ({
  componentsAbove,
  componentsBelow,
  notesComponents,
}) => {
  const componentRenderer: LedgerComponentRenderer = (y, isLine, height) => {
    return <LedgerComponent height={height} isLine={isLine} />;
  };
  return (
    <div className={classes.container}>
      <Segment
        width={"100%"}
        belowBody={componentsBelow}
        aboveBody={componentsAbove}
        renderLedgerComponent={componentRenderer}
        startWithLine
        body={7}
        className={classes.body}
      />
      {notesComponents}
    </div>
  );
};

export default DisplayMeasure;
