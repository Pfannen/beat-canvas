import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import { RegistryDelegates } from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import useSplitSegment from "@/components/hooks/useSplitSegement";

type SplitSegmentProps = {
  registryDelegates: RegistryDelegates;
  lhs?: number;
  segment: ReactNode;
  identifier: number;
  width: number;
  canSplit: boolean;
  smallestWidth: number;
};

const SplitSegment: FunctionComponent<SplitSegmentProps> = (props) => {
  const { split } = useSplitSegment(
    props.identifier,
    props.registryDelegates,
    props.canSplit,
    props.lhs
  );
  if (!split || props.width <= props.smallestWidth) {
    return props.segment;
  } else {
    const splitWidth = props.width / 2;
    return (
      <>
        <SplitSegment {...props} width={splitWidth} lhs={undefined} />
        <SplitSegment
          {...props}
          width={splitWidth}
          identifier={props.identifier + splitWidth}
          lhs={props.identifier}
        />
      </>
    );
  }
};

export default SplitSegment;
