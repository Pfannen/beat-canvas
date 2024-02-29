// import { minimalSegmentGenerator } from "@/components/ui/reusable/segment-split/utils";
import SegmentedMeasure from "../..";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { Note, NoteType } from "@/components/providers/music/types";
import SplitSegment from "../../../segment/split-segment";
import { ModificationBehavior } from "../../../utils";
import useSplitSegmentRegistry from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import { minimalSegmentGenerator } from "@/utils/segments/segment-gen-1";

type ModifiableMeasureProps = {
  index: number;
  notes: Note[];
  noteSelected?: NoteType;
  modificationBehavior: ModificationBehavior<any>;
  placeNote: (note: Note, measureIndex: number) => void;
};

const ModifiableMeasure: FunctionComponent<ModifiableMeasureProps> = ({
  index,
  notes,
  noteSelected,
  modificationBehavior,
  placeNote,
}) => {
  const { getRegistryProps, getSegmentActions } = useSplitSegmentRegistry();
  const onNotePlace = (note: Note) => {
    placeNote(note, index);
  };
  return (
    <SegmentedMeasure
      segmentGenerator={minimalSegmentGenerator}
      notes={notes}
      timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
      renderSegment={(props) => {
        return (
          <SplitSegment
            actionHandler={modificationBehavior(
              getSegmentActions({
                placeNote: onNotePlace,
              }),
              noteSelected
            )}
            {...props}
            registryDelegates={getRegistryProps()}
          />
        );
      }}
    />
  );
};

export default ModifiableMeasure;
