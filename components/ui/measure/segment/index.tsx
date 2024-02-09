import { FunctionComponent } from "react";
import { LedgerComponentRenderer, generateMeasureComponents } from "../utils";
import { MeasureUtils } from "@/objects/note-position";

type Props = {
  belowBody?: number;
  aboveBody?: number;
  body?: number;
  width: string;
  className?: string;
  startWithLine?: boolean; //To render a line or a space first
  lineToSpaceRatio?: number;
  renderLedgerComponent: LedgerComponentRenderer;
};

const Segment: FunctionComponent<Props> = (props) => {
  const { belowBody = 0, body = 7, aboveBody = 0 } = props;
  const { lineToSpaceRatio = 3 } = props;
  const totalComponents = belowBody + body + aboveBody;
  const { percentPerLine, percentPerSpace } =
    MeasureUtils.getLedgerComponentHeights(
      totalComponents,
      lineToSpaceRatio,
      !!props.startWithLine
    );
  const components = generateMeasureComponents(
    belowBody,
    aboveBody,
    percentPerLine * 100 + "%",
    percentPerSpace * 100 + "%",
    !!props.startWithLine,
    props.renderLedgerComponent,
    props.body
  );
  return (
    <div className={props.className} style={{ width: props.width }}>
      {components[0]}
      {components[1]}
      {components[2]}
    </div>
  );
};

export default Segment;
