import { concatClassNames } from "@/utils/css";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

type NoteBodyProps = {
  height: string;
  fill?: boolean;
  children?: ReactNode;
};

const NoteBody: FunctionComponent<NoteBodyProps> = ({
  height,
  fill,
  children,
}) => {
  return (
    <div
      className={concatClassNames(classes.note_body, fill && classes.fill)}
      style={{ "--height": height } as CSSProperties}
    >
      {children}
    </div>
  );
};

export default NoteBody;
