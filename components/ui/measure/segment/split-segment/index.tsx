import classes from "./index.module.css";
import LedgerComponent from "../../ledger-component";
import Segment from "..";
import { SegmentProps } from "../../types";
import { FunctionComponent } from "react";
import { SegmentBeat } from "@/components/providers/music/types";
import { RegistryDelegates } from "@/components/hooks/useSplitSegement-old/useSplitSegmentRegistry";
import { LedgerComponentRenderer } from "../../utils";
import DisplayNote from "../../measure-item/measure-note";
import { fractionToPercent } from "@/utils";
import { concatClassNames } from "@/utils/css";
import useSplitSegment from "@/components/hooks/useSplitSegement-old";

type SplitSegmentProps = {
  registryDelegates: RegistryDelegates;
  lhs?: number;
} & SegmentProps<any>;

const SplitSegment: FunctionComponent<SplitSegmentProps> = (props) => {
  const { split } = useSplitSegment(
    props.xPos,
    props.registryDelegates,
    !props.notes,
    props.lhs
  );

  const { width } = props;
  const renderLedgerComponent: LedgerComponentRenderer = (
    yPos,
    isLine,
    linePercent,
    spacePercent,
    isBodyComponent
  ) => {
    const containsNote =
      props.notes &&
      props.notes[0].y === yPos &&
      props.notes[0].x === props.xPos;
    return (
      <LedgerComponent
        onClick={() => {
          props.actionHandler("left-click", props.xPos, yPos);
        }}
        onAuxClick={() => {
          props.actionHandler("middle-click", props.xPos, yPos);
        }}
        className={concatClassNames(
          classes.component,
          !isBodyComponent && classes.light
        )}
        height={
          isLine
            ? fractionToPercent(linePercent)
            : fractionToPercent(spacePercent)
        }
        isLine={isLine}
      >
        {containsNote && (
          <DisplayNote
            containerProps={{
              height: isLine
                ? fractionToPercent(spacePercent / linePercent)
                : fractionToPercent(1),

              bottom: "50%",
              left: "50%",
            }}
            type={props.notes![0].type}
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
        width={fractionToPercent(width)}
        lineToSpaceRatio={1.5}
      />
    );
  } else {
    console.log("Split", props.xPos);
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
