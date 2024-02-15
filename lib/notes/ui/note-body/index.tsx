import { concatClassNames } from "@/utils/css";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

type NoteBodyProps = {
  height: string;
  notFilled?: boolean;
  children?: ReactNode;
};

const NoteBody: FunctionComponent<NoteBodyProps> = ({
  height,
  notFilled,
  children,
}) => {
  return (
    <div
      className={concatClassNames(
        classes.note_body,
        notFilled && classes.not_filled
      )}
      style={{ "--height": height } as CSSProperties}
    >
      {children}
      {notFilled && (
        <div className={concatClassNames("center", classes.hole)} />
      )}
    </div>
  );
};

export default NoteBody;
