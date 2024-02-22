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
      className={classes.body_container}
      style={{ "--height": height } as CSSProperties}
    >
      <div
        className={concatClassNames(
          classes.note_body,
          !isFilled && classes.not_filled
        )}
      >
        {!isFilled && (
          <div className={concatClassNames("center", classes.hole)} />
        )}
      </div>
      {children}
    </div>
  );
};

export default NoteBody;
