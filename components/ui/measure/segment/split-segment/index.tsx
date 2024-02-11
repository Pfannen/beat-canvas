import classes from "./index.module.css";
import LedgerComponent from "../../ledger-component";
import Segment from "..";
import { SegmentProps } from "../../types";
import { FunctionComponent, useEffect, useState } from "react";
import { SegmentBeat } from "@/components/providers/music/types";
import { RegistryDelegates } from "@/components/hooks/useSplitSegmentRegistry";
import { LedgerComponentRenderer } from "../../utils";
import DisplayNote from "../../note/display-note";
import { numToPercent } from "@/utils";

type SplitSegmentProps = {
  registryDelegates: RegistryDelegates;
  lhs?: number;
} & SegmentProps<any>;

const SplitSegment: FunctionComponent<SplitSegmentProps> = (props) => {
  const [split, setSplit] = useState(false);

  useEffect(() => {
    props.registryDelegates.register(
      props.xPos,
      () => {
        setSplit((prevState) => !prevState);
      },
      props.lhs
    );
    return () => {
      props.registryDelegates.deregister(props.xPos);
    };
  }, []);

  const { width } = props;
  const renderLedgerComponent: LedgerComponentRenderer = (
    yPos,
    isLine,
    linePercent,
    spacePercent,
    isBodyComponent
  ) => {
    return (
      <LedgerComponent
        onClick={() => {
          props.actionHandler("left-click", props.xPos, yPos);
        }}
        onAuxClick={() => {
          props.actionHandler("middle-click", props.xPos, yPos);
        }}
        className={classes.component}
        height={isLine ? numToPercent(linePercent) : numToPercent(spacePercent)}
        isLine={isLine}
      >
        {props.notes && props.notes[0].y === yPos && (
          <DisplayNote
            height={
              isLine
                ? numToPercent(spacePercent / linePercent)
                : numToPercent(1)
            }
            bottom={"50%"}
            left={"50%"}
            type={props.notes[0].type}
          />
        )}
      </LedgerComponent>
    );
  };
  if (!split || width <= 0.25 / 8) {
    return (
      <Segment
        belowBody={3}
        aboveBody={3}
        renderLedgerComponent={renderLedgerComponent}
        width={width * 100 + "%"}
      />
    );
  } else {
    return (
      <>
        <SplitSegment
          {...props}
          width={width / 2}
          beatPercentage={(props.beatPercentage / 2) as SegmentBeat}
          lhs={undefined}
        />
        <SplitSegment
          {...props}
          width={width / 2}
          xPos={props.xPos + props.beatPercentage / 2}
          beatPercentage={(props.beatPercentage / 2) as SegmentBeat}
          lhs={props.xPos}
        />
      </>
    );
  }
};

export default SplitSegment;
