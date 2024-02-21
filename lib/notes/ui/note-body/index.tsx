import { concatClassNames } from "@/utils/css";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

type NoteBodyProps = {
  height: string;
  isFilled?: boolean;
  children?: ReactNode;
};

const NoteBody: FunctionComponent<NoteBodyProps> = ({
  height,
  isFilled,
  children,
}) => {
  return (
    <div
      className={concatClassNames(
        classes.note_body,
        !isFilled && classes.not_filled
      )}
      style={{ "--height": height } as CSSProperties}
    >
      {children}
      {!isFilled && (
        <div className={concatClassNames("center", classes.hole)} />
      )}
    </div>
  );
};

export default NoteBody;
