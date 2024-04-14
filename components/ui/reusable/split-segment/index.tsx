import { ComponentProps, FunctionComponent } from "react";
import { RegistryDelegates } from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import useSplitSegment from "@/components/hooks/useSplitSegement";
import { OmittedComponentProps } from "@/types/polymorphic";
import { SegmentDelegates } from "@/types/measure-modification/segments";

type SplitSegmentProps<
  C extends FunctionComponent<
    { width: number } & OmittedComponentProps<C, "width">
  >
> = {
  as: C;
  getComponentProps: (identifier: number) => OmittedComponentProps<C, "width">;
  registryDelegates: RegistryDelegates;
  lhs?: number;
  identifier: number;
  rightSiblingIdentifier: number;
  width: number;
  canSplit: boolean;
  minWidth: number;
} & SegmentDelegates<number>;

const SplitSegment = <
  C extends FunctionComponent<
    { width: number } & OmittedComponentProps<C, "width">
  >
>(
  props: SplitSegmentProps<C>
) => {
  const Component = props.as as any;
  const { split } = useSplitSegment(
    props.identifier,
    props.registryDelegates,
    props.canSplit,
    props.lhs
  );
  if (!split || props.width <= props.minWidth) {
    const restProps = props.getComponentProps(props.identifier);
    return <Component {...restProps} width={props.width} />;
  } else {
    const { left, right } = props.getChildrenKeys(
      props.identifier,
      props.rightSiblingIdentifier
    );
    const splitWidth = props.width / 2;
    return (
      <>
        <SplitSegment
          {...props}
          width={splitWidth}
          identifier={left}
          rightSiblingIdentifier={right}
          lhs={undefined}
        />
        <SplitSegment
          {...props}
          identifier={right}
          width={splitWidth}
          lhs={left}
        />
      </>
    );
  }
};

export default SplitSegment;
