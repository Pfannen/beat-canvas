import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent, useRef } from "react";
import NotePosition from "@/objects/note-position";
import { getNoteDuration } from "@/components/providers/music/utils";
import { useMusic } from "@/components/providers/music";
import DisplayMeasure from "./display-measure";
import DisplayNote from "../note/display-note";

type DisplayMeasuresProps = {};

const DisplayMeasures: FunctionComponent<DisplayMeasuresProps> = () => {
  const { measures } = useMusic();
  const notePosition = useRef(new NotePosition(7, 25, 100, true));
  const noteComponents = measures.map(({ notes }) => {
    return notes.map((note) => {
      const length = getNoteDuration(note.type, 4);
      const { x, y } = notePosition.current.getNoteOffset({ ...note, length });
      console.log(x, y);
      const component = <DisplayNote bottom={y + "%"} left={x + "%"} />;
      return component;
    });
  });
  console.log(noteComponents);
  return (
    <>
      {noteComponents.map((measureNotes) => {
        return <DisplayMeasure notesComponents={measureNotes} />;
      })}
    </>
  );
};

export default DisplayMeasures;
