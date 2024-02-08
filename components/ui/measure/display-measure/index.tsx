import LedgerComponent from "../ledger-component";
import Segment from "../segment";
import { LedgerComponentRenderer } from "../utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

type DisplayMeasureProps = {
  componentsBelow?: number;
  componentsAbove?: number;
  notesComponents?: ReactNode;
};

const DisplayMeasure: FunctionComponent<DisplayMeasureProps> = ({
  componentsAbove = 0,
  componentsBelow = 0,
  notesComponents,
}) => {
  const componentRenderer: LedgerComponentRenderer = (y, isLine, height) => {
    return <LedgerComponent height={height} isLine={isLine} />;
  };
  // const paddingTop =
  //   componentsAbove * lineHeight + componentsAbove * spaceHeight + heightUnit;
  // const paddingBottom =
  //   componentsBelow * lineHeight + componentsBelow * spaceHeight + heightUnit;
  return (
    <div
      className={classes.container}
      // style={
      //   {
      //     "--padding-top": paddingTop,
      //     "--padding-bottom": paddingBottom,
      //   } as CSSProperties
      // }
    >
      <Segment
        width={1}
        belowBody={componentsBelow}
        aboveBody={componentsAbove}
        renderLedgerComponent={componentRenderer}
        startWithLine
        body={7}
      />
      {notesComponents}
    </div>
  );
};

export default DisplayMeasure;
