import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type SegmentedMeasuresProps = {
  measures: Measure[];
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = () => {
  return <div className={classes.measures}></div>;
};

export default SegmentedMeasures;
