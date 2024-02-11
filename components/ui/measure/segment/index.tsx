import { FunctionComponent } from "react";
import { LedgerComponentRenderer, generateMeasureComponents } from "../utils";
import { ComponentPercentages, MeasureUtils } from "@/objects/note-position";

type Props = {
  belowBody?: number;
  aboveBody?: number;
  body?: number;
  width: string;
  className?: string;
  startWithLine?: boolean; //To render a line or a space first (starting at the bottom)
  lineToSpaceRatio?: number;
  componentPercentages?: ComponentPercentages;
  renderLedgerComponent: LedgerComponentRenderer;
};

const Segment: FunctionComponent<Props> = (props) => {
  const { belowBody = 0, body = 7, aboveBody = 0 } = props;
  const { lineToSpaceRatio = 3 } = props;
  let { componentPercentages } = props;
  const totalComponents = belowBody + body + aboveBody;
  if (!componentPercentages) {
    componentPercentages = MeasureUtils.getLedgerComponentHeights(
      totalComponents,
      lineToSpaceRatio,
      !!props.startWithLine
    );
  }

  const components = generateMeasureComponents(
    belowBody,
    aboveBody,
    componentPercentages.line,
    componentPercentages.space,
    !!props.startWithLine,
    props.renderLedgerComponent,
    props.body
  );
  return (
    <span className={props.className} style={{ width: props.width }}>
      {components}
    </span>
  );
};

export default Segment;
