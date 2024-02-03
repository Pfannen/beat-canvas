"use client";

import classes from "./index.module.css";
import { FunctionComponent } from "react";
import Segment from "./segment";

type MeasureProps = {};

const Measure: FunctionComponent<MeasureProps> = () => {
  const width = "25%";
  const lineHeight = "10px";
  const spaceHeight = "20px";
  return (
    <div className={classes.measure}>
      <Segment
        width={width}
        lineHeight={lineHeight}
        spaceHeight={spaceHeight}
        belowBody={3}
        aboveBody={3}
      />
      <Segment
        width={width}
        lineHeight={lineHeight}
        spaceHeight={spaceHeight}
        belowBody={3}
        aboveBody={3}
      />
      <Segment
        width={width}
        lineHeight={lineHeight}
        spaceHeight={spaceHeight}
        belowBody={3}
        aboveBody={3}
      />
      <Segment
        width={width}
        lineHeight={lineHeight}
        spaceHeight={spaceHeight}
        belowBody={3}
        aboveBody={3}
      />
    </div>
  );
};

export default Measure;
