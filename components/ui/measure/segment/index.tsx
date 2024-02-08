import { FunctionComponent } from "react";
import { LedgerComponentRenderer, generateMeasureComponents } from "../utils";
import { MeasureUtils } from "@/objects/note-position";

type Props = {
  belowBody: number;
  aboveBody: number;
  body?: number;
  width: number;
  className?: string;
  startWithLine?: boolean; //To render a line or a space first
  spaceToLineRatio?: number;
  renderLedgerComponent: LedgerComponentRenderer;
};

const Segment: FunctionComponent<Props> = (props) => {
  const { belowBody, body = 9, aboveBody } = props;
  const { spaceToLineRatio = 0.25 } = props;
  const totalComponents = belowBody + body + aboveBody;
  const { percentPerLine, percentPerSpace } =
    MeasureUtils.getLedgerComponentHeights(
      totalComponents,
      spaceToLineRatio,
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
    <div
      className={props.className}
      style={{ width: props.width * 100 + "%", height: "100%" }}
    >
      {components[0]}
      {components[1]}
      {components[2]}
    </div>
  );
};

export default Segment;
