import { NoteType } from "@/components/providers/music/types";
import MeasureItem, { MeasureItemContainerProps } from "..";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { getRestComponent } from "@/lib/notes/ui/rests";

type MeasureRestProps = {
  containerProps: MeasureItemContainerProps;
  type: NoteType;
};

const MeasureRest: FunctionComponent<MeasureRestProps> = ({
  containerProps,
  type,
}) => {
  const Rest = getRestComponent(type);
  return (
    <MeasureItem {...containerProps}>
      <Rest />
    </MeasureItem>
  );
};

export default MeasureRest;
