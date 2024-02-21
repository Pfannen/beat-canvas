import { UnitMeasurement } from "@/types";
import NoteBody from "../note-body";
import NoteStaff from "../note-staff";
import { FunctionComponent } from "react";
import { BodyAttribute, NoteDirection, StaffAttribute } from "../../types";
import { numToUnit } from "@/utils";
import { NonConfigAttributes } from "../note-attributes";
import { NoteType } from "@/components/providers/music/types";
import { getTypeDetails, reduceAttributes } from "../utils";

type NoteProps = {
  type: NoteType;
  bodyHeight?: number;
  staffHeightMultiplier?: number;
  unit?: UnitMeasurement;
  direction?: NoteDirection;
  attributes?: NonConfigAttributes[];
  extraAttributes?: (BodyAttribute | StaffAttribute)[];
  attachTypeAttributes?: boolean;
};

const Note: FunctionComponent<NoteProps> = (props) => {
  const {
    bodyHeight = 1,
    staffHeightMultiplier = 1.75,
    unit = "%",
    direction = "up",
    attachTypeAttributes = true,
  } = props;

  const { bodyComponents, staffComponents } = reduceAttributes(
    direction,
    props.type,
    props.attributes,
    props.extraAttributes,
    attachTypeAttributes
  );

  const { isFilled, isStaffed } = getTypeDetails(props.type);
  return (
    <NoteBody height={numToUnit(bodyHeight, unit)} isFilled={isFilled}>
      <NoteStaff
        heightMultiplier={staffHeightMultiplier}
        direction={direction}
        hide={!isStaffed}
      >
        {staffComponents}
      </NoteStaff>
      {bodyComponents}
    </NoteBody>
  );
};

export default Note;
