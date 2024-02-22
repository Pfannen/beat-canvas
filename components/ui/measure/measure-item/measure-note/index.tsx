import Note, { NoteProps } from "@/lib/notes/ui/note";
import { FunctionComponent } from "react";
import MeasureItem, { MeasureItemContainerProps } from "..";

type DisplayNoteProps = {
  containerProps: MeasureItemContainerProps;
} & NoteProps;

const DisplayNote: FunctionComponent<DisplayNoteProps> = ({
  containerProps,
  ...restProps
}) => {
  return (
    <MeasureItem {...containerProps}>
      <Note {...restProps} />
    </MeasureItem>
  );
};

export default DisplayNote;
