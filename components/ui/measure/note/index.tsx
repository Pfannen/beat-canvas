import { PolymorphicComponentProps } from "@/types/polymorphic";
import DropItem from "../../reusable/drag-drop/drop-item";
import classes from "./index.module.css";
import { ElementType, FunctionComponent } from "react";
import { concatClassNames } from "@/utils/css";

type NoteProps = {};

const Note = <C extends ElementType = "div">({
  as,
  className,
  ...restProps
}: PolymorphicComponentProps<C, NoteProps>) => {
  const Component = as || "div";
  return (
    <Component
      className={concatClassNames(classes.note, className)}
      {...restProps}
    />
  );
};

export default Note;
