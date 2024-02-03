import DropContainer from "@/components/ui/reusable/drag-drop/drop-container";
import LedgerComponent from "../ledger-component";
import classes from "./index.module.css";
import { FunctionComponent, useState } from "react";
import { generateMeasureComponents } from "../utils";

type SegmentProps = {
  width: number;
  lineHeight: string;
  spaceHeight: string;
  belowBody: number;
  aboveBody: number;
};

const Segment: FunctionComponent<SegmentProps> = ({
  width,
  lineHeight,
  spaceHeight,
  belowBody,
  aboveBody,
}) => {
  const [split, setSplit] = useState(false);
  const components = generateMeasureComponents(belowBody, aboveBody, (yPos) => {
    const isLine = yPos % 2 != 0;
    const height = isLine ? lineHeight : spaceHeight;
    return (
      <LedgerComponent
        as={DropContainer}
        onDrop={(d: string) => {
          console.log(d, yPos);
        }}
        onDragEnter={() => {
          console.log("enter");
          setTimeout(() => {
            setSplit(true);
          }, 1000);
        }}
        dataName="note"
        height={height}
        isLine={isLine}
      />
    );
  });
  if (!split || width <= 0.25 / 8) {
    return (
      <div className={classes.segment} style={{ width: width * 100 + "%" }}>
        {components[0]}
        <div className={classes.body}>{components[1]}</div>
        {components[2]}
      </div>
    );
  } else {
    return (
      <>
        <Segment
          width={width / 2}
          lineHeight={lineHeight}
          spaceHeight={spaceHeight}
          belowBody={belowBody}
          aboveBody={aboveBody}
        />
        <Segment
          width={width / 2}
          lineHeight={lineHeight}
          spaceHeight={spaceHeight}
          belowBody={belowBody}
          aboveBody={aboveBody}
        />
      </>
    );
  }
};

export default Segment;
