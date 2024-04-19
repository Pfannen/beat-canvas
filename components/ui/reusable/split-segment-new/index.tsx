import { FunctionComponent } from "react";
import { SegmentDelegates } from "@/types/measure-modification/segments";
import useSplitState from "@/components/hooks/useSplitState-new";

export type SplitSegmentComponentProps = {
  onSplit: () => void;
  onJoin: () => void;
  onCollapse: () => void;
  width: number;
};

type SplitSegmentProps = {
  getComponent: (
    identifier: number
  ) => FunctionComponent<SplitSegmentComponentProps>;
  identifier: number;
  rightSiblingIdentifier: number;
  width: number;
  onCollapse?: () => void;
  canSplit: boolean;
  minWidth: number;
  isSplit: boolean;
} & SegmentDelegates<number>;

const SplitSegment: FunctionComponent<SplitSegmentProps> = (props) => {
  const [isSplit, split, join] = useSplitState(props.canSplit, props.isSplit);
  if (!isSplit || props.width <= props.minWidth) {
    const Component = props.getComponent(props.identifier);
    return (
      <Component
        onSplit={split}
        onJoin={props.onCollapse || join}
        onCollapse={join}
        width={props.width}
      />
    );
  } else {
    const { left, right } = props.getChildrenKeys(
      props.identifier,
      props.rightSiblingIdentifier
    );
    const splitWidth = props.width / 2;
    const onCollapse = props.onCollapse || join;
    return (
      <>
        <SplitSegment
          {...props}
          width={splitWidth}
          identifier={left}
          rightSiblingIdentifier={right}
          onCollapse={onCollapse}
        />
        <SplitSegment
          {...props}
          identifier={right}
          width={splitWidth}
          onCollapse={onCollapse}
        />
      </>
    );
  }
};

export default SplitSegment;
