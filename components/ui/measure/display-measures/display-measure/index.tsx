import LedgerComponent from "../../ledger-component";
import Segment from "../../segment";
import { LedgerComponentRenderer } from "../../utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import { fractionToPercent } from "@/utils";
import { ComponentProps } from "@/types/polymorphic";
import { concatClassNames } from "@/utils/css";
import { ComponentFractions } from "@/objects/music/note-position";

const bodyCt = 9;

type DisplayMeasureProps = {
  componentsAbove?: number;
  componentsBelow?: number;
  noteComponents?: ReactNode;
  componentFractions?: ComponentFractions;
  height: string;
  padding: string;
} & ComponentProps<"div">;

const DisplayMeasure: FunctionComponent<DisplayMeasureProps> = ({
  componentsAbove,
  componentsBelow,
  noteComponents,
  componentFractions,
  height,
  padding,
  className,
  ...restProps
}) => {
  const componentRenderer: LedgerComponentRenderer = (
    y,
    isLine,
    lineHeight,
    spaceHeight
  ) => {
    return (
      <LedgerComponent
        height={
          isLine
            ? fractionToPercent(lineHeight)
            : fractionToPercent(spaceHeight)
        }
        isLine={isLine}
        className={classes.component}
        key={y}
      />
    );
  };
  return (
    <div
      style={{ "--body-height": height, "--padding": padding } as CSSProperties}
      className={concatClassNames(classes.container, className)}
      {...restProps}
    >
      <Segment
        width={"100%"}
        belowBody={componentsBelow}
        aboveBody={componentsAbove}
        renderLedgerComponent={componentRenderer}
        startWithLine
        body={bodyCt}
        componentFractions={componentFractions}
      />
      {noteComponents}
    </div>
  );
};

export default DisplayMeasure;
