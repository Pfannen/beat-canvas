import DropContainer from "../../reusable/drag-drop/drop-container";
import LedgerComponent from "../ledger-component";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type SegmentProps = {
  width: string;
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
  const ledgerComponents = [];
  const totalComponents = 9 + belowBody + aboveBody;
  for (let i = 0; i < totalComponents; i++) {
    const isLine = i % 2 !== 0;
    const height = isLine ? lineHeight : spaceHeight;
    ledgerComponents.push(
      <LedgerComponent
        as={DropContainer}
        onDrop={(data: string) => {
          console.log(data);
        }}
        dataName="note"
        height={height}
        isLine={isLine}
      />
    );
  }
  return (
    <div className={classes.segment} style={{ width }}>
      {ledgerComponents}
    </div>
  );
};

export default Segment;
