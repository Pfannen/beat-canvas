import { FunctionComponent } from "react";
import { LedgerComponentRenderer, generateMeasureComponents } from "../utils";

type Props = {
  belowBody: number;
  aboveBody: number;
  width: number;
  className?: string;
  aboveClassName?: string;
  belowClassName?: string;
  bodyClassName?: string;
  renderLedgerComponent: LedgerComponentRenderer;
};

const Segment: FunctionComponent<Props> = (props) => {
  const { belowBody, aboveBody } = props;
  const components = generateMeasureComponents(
    belowBody,
    aboveBody,
    props.renderLedgerComponent
  );
  return (
    <div className={props.className} style={{ width: props.width * 100 + "%" }}>
      <span className={props.aboveClassName}>{components[0]}</span>
      <span className={props.bodyClassName}>{components[1]}</span>
      <span className={props.belowClassName}>{components[2]}</span>
    </div>
  );
};

export default Segment;
