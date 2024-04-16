import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";

type SegmentButtonProps = {
  className: string;
  onClick: () => void;
  children: ReactNode;
};

const SegmentButton: FunctionComponent<SegmentButtonProps> = ({
  className,
  onClick,
  children,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default SegmentButton;
