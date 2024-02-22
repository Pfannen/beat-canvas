import { NoteType } from "@/components/providers/music/types";
import Note from "@/lib/notes/ui/note";
import { FunctionComponent } from "react";
import MeasureItem, { MeasureItemContainerProps } from "..";

type DisplayNoteProps = {
  containerProps: MeasureItemContainerProps;
  type: NoteType;
};

const DisplayNote: FunctionComponent<DisplayNoteProps> = ({
  containerProps,
  type,
}) => {
  return (
    <MeasureItem {...containerProps}>
      <Note type={type} />
    </MeasureItem>
  );
};

export default DisplayNote;
