import { FunctionComponent, ReactNode, useState } from "react";
import classes from "./dropdown-list.module.css";
import DropdownHeader, { DropdownHeaderProps } from "./dropdown-header";
import { concatClassNames } from "@/utils/css";
import DropdownArrow from "../../svg/dropdown-arrow";

interface DropdownListProps {
  children: ReactNode;
  title: string;
  headerIcon?: ReactNode;
  headerClassName?: string;
  className?: string;
  selectionsClassName?: string;
}

const DropdownList: FunctionComponent<DropdownListProps> = ({
  children,
  title,
  headerIcon,
  headerClassName,
  className,
  selectionsClassName,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={concatClassNames(className, classes.dropdown)}>
      <div
        className={concatClassNames(classes.header, headerClassName)}
        onClick={() => setShow((prev) => !prev)}
      >
        {headerIcon && <div className={classes.icon}>{headerIcon}</div>}
        <p>{title}</p>
        <DropdownArrow
          className={concatClassNames(
            classes.arrow,
            show ? classes.show : classes.hide
          )}
        />
      </div>
      <div
        className={concatClassNames(
          classes.dummy_div,
          show ? classes.show : classes.hide
        )}
      >
        <ul
          className={concatClassNames(
            selectionsClassName,
            classes.ul,
            show ? classes.show : classes.hide
          )}
        >
          {children}
        </ul>
      </div>
    </div>
  );
};

export default DropdownList;
