import classes from "./index.module.css";
import DropContainer from "../../../reusable/drag-drop/drop-container";
import LedgerComponent from "../../ledger-component";
import Segment from "..";
import { SegmentProps } from "../../types";
import { FunctionComponent, useState } from "react";
import { SegmentBeat } from "@/components/providers/music/types";

type SplitSegmentProps = {
  lineHeight: string;
  spaceHeight: string;
} & SegmentProps;

const SplitSegment: FunctionComponent<SplitSegmentProps> = (props) => {
  const [split, setSplit] = useState(false);
  const { lineHeight, spaceHeight, width } = props;
  const renderLedgerComponent = (yPos: number, isLine: boolean) => {
    const height = isLine ? lineHeight : spaceHeight;
    return (
      <LedgerComponent
        as={DropContainer}
        onDrop={(d: string) => {
          console.log(d, yPos);
        }}
        onDragEnter={() => {
          setSplit(true);
        }}
        dataName="note"
        height={height}
        isLine={isLine}
      />
    );
  };
  if (!split || width <= 0.25 / 8) {
    return (
      <Segment
        belowBody={3}
        aboveBody={3}
        renderLedgerComponent={renderLedgerComponent}
        width={width}
        aboveClassName={classes.light}
        belowClassName={classes.light}
      />
    );
  } else {
    return (
      <>
        <SplitSegment
          {...props}
          width={width / 2}
          beatPercentage={(props.beatPercentage / 2) as SegmentBeat}
        />
        <SplitSegment
          {...props}
          width={width / 2}
          xPos={props.xPos + props.beatPercentage / 2}
          beatPercentage={(props.beatPercentage / 2) as SegmentBeat}
        />
      </>
    );
  }
};

export default SplitSegment;
