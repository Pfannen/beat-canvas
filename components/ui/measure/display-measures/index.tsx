import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { useMusic } from "@/components/providers/music";
import DisplayMeasure from "./display-measure";
import { concatClassNames } from "@/utils/css";
import { getMeasureItems } from "./utils";
import Measurement from "@/objects/measurement";

const aspectRatio = 4 / 3;

const measurement = new Measurement(5, 0.25, 1);

type DisplayMeasuresProps = {
  onMeasureClick: (index: number) => void;
  className?: string;
  isMeasureSelected: (index: number) => boolean;
  selectedMeasureClassName?: string;
  notSelectedMeasureClassName?: string;
};

const DisplayMeasures: FunctionComponent<DisplayMeasuresProps> = ({
  onMeasureClick,
  className,
  isMeasureSelected,
  selectedMeasureClassName,
  notSelectedMeasureClassName,
}) => {
  const { measures } = useMusic();
  const linePercent = measurement.getLineFraction() * 100;
  const spacePercent = measurement.getSpaceFraction() * 100;
  const padding =
    measurement.getAboveBelowLines() * linePercent +
    measurement.getAboveBelowSpaces() * spacePercent;
  const bodyPercent = 1 - padding * 2;
  const noteComponents = getMeasureItems(measures, measurement);
  return (
    <div className={concatClassNames(classes.measures, className)}>
      {noteComponents.map((measureNotes, i) => {
        return (
          <DisplayMeasure
            noteComponents={measureNotes}
            componentFractions={{
              space: measurement.getSpaceFraction(),
              line: measurement.getLineFraction(),
            }}
            height={bodyPercent + "%"}
            padding={padding + "%"}
            onClick={onMeasureClick.bind(null, i)}
            className={
              isMeasureSelected(i)
                ? selectedMeasureClassName
                : notSelectedMeasureClassName
            }
          />
        );
      })}
    </div>
  );
};

export default DisplayMeasures;
