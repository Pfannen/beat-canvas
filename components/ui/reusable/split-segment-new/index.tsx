import { FunctionComponent } from "react";
import {
  OmmittedFunctionProps,
  PolymorphicFunctionComponentProps,
} from "@/types/polymorphic";
import { SegmentDelegates } from "@/types/measure-modification/segments";
import useSplitState from "@/components/hooks/useSplitState-new";

type InternalProps = {
  onSplit: () => void;
  onJoin: () => void;
  onCollapse: () => void;
  width: number;
};

type SplitSegmentComponent<P = {}> = FunctionComponent<InternalProps & P>;

type SplitSegmentProps<C extends SplitSegmentComponent> = {
  getComponentProps: (
    identifier: number
  ) => OmmittedFunctionProps<C, InternalProps>;
  //   lhs?: number;
  identifier: number;
  rightSiblingIdentifier: number;
  width: number;
  onCollapse?: () => void;
  canSplit: boolean;
  minWidth: number;
} & SegmentDelegates<number>;

const SplitSegment = <C extends SplitSegmentComponent>(
  props: PolymorphicFunctionComponentProps<C, SplitSegmentProps<C>>
) => {
  const Component = props.as as any;
  const [isSplit, split, join] = useSplitState(props.canSplit);
  if (!isSplit || props.width <= props.minWidth) {
    const restProps = props.getComponentProps(props.identifier);
    return (
      <Component
        {...restProps}
        width={props.width}
        onSplit={split}
        onJoin={join}
        onCollapse={join}
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
          //   lhs={undefined}
          onCollapse={onCollapse}
        />
        <SplitSegment
          {...props}
          identifier={right}
          width={splitWidth}
          //   lhs={left}
          onCollapse={onCollapse}
        />
      </>
    );
  }
};

export default SplitSegment;
