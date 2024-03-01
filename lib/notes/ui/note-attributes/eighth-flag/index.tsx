import { AxisProps } from "@/lib/notes/types";
import AbsoluteContainer from "../../absolute-container";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type EighthFlagProps = {} & AxisProps;

const EighthFlag: FunctionComponent<EighthFlagProps> = ({ ...axisProps }) => {
  return (
    <AbsoluteContainer className={classes.flag} {...axisProps} xPercent="-100%">
      <FlagSvg />
    </AbsoluteContainer>
  );
};

export default EighthFlag;

const FlagSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18.86 37.36"
    scale={10}
    height={"75%"}
  >
    <path d="M18.84,24.95c-.05,2.2-1.05,4.04-2.13,5.86-1.27,2.15-3.06,3.82-4.94,5.41-.43.37-.89.73-1.36,1.05-.14.09-.39.12-.55.06-.44-.17-.5-.53-.14-.84.66-.58,1.36-1.11,2-1.7,1.48-1.34,2.83-2.77,3.8-4.54.99-1.79,1.39-3.7,1.35-5.74-.04-1.81-.77-3.3-1.8-4.73-1.14-1.57-2.61-2.77-4.18-3.87-2.75-1.93-5.24-3.16-8.94-4.91C1.12,10.61.44,10.3,0,10.1,0,6.73,0,3.37.01,0,.54,0,1.05,0,1.55.01c.07,0,.17.13.2.22.57,1.4,1.28,2.7,2.22,3.88,1.4,1.75,3.01,3.29,4.84,4.57,1.77,1.24,3.46,2.57,4.99,4.09,2.28,2.25,4.01,4.82,4.75,7.98.32,1.39.33,2.79.29,4.2Z" />
  </svg>
);
