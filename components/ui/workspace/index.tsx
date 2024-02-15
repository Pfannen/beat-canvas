"use client";

import ReactModal from "react-modal";
import DisplayMeasures from "../measure/display-measures";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import ModifiableMeasure from "../measure/segmented-measure/modifiable-measure";
import { clickBehavior } from "../measure/utils";
import useWorkSpace from "./hooks/useWorkspace";
import ControlButtons, { ControlButton } from "./control-buttons";

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
  const ws = useWorkSpace();

  const buttons: ControlButton[] = [
    {
      label: "Add Measure",
      buttonProps: {
        onClick: ws.measureDels.addMeasureSelection,
      },
    },
    {
      label: "Duplicate Measures",
      buttonProps: {
        onClick: ws.setMode.bind(null, "duplicate"),
        disabled: !ws.isSelectedMeasures(),
      },
    },
    {
      label: "Modify",
      buttonProps: {
        onClick: () => {
          console.log("Hello");
        },
        disabled: !ws.isSelectedMeasures(),
      },
    },
    {
      label: "Remove",
      buttonProps: {
        onClick: ws.measureDels.removeMeasureSelection,
        disabled: !ws.isSelectedMeasures(),
      },
    },
  ];

  return (
    <>
      <ControlButtons buttons={buttons} />
      <div className={classes.measures}>
        <DisplayMeasures
          onMeasureClick={ws.onMeasureClick}
          className={classes.measure}
          isMeasureSelected={ws.isMeasureSelected}
          selectedMeasureClassName={classes.selected}
          notSelectedMeasureClassName={
            ws.isSelectedMeasures() ? classes.not_selected : undefined
          }
        />
      </div>
      {/* <ReactModal
        isOpen={mode === "modify" && !!selectedMeasures.length}
        onRequestClose={() => {
          setSelectedMeasures([]);
        }}
        shouldCloseOnOverlayClick={true}
      >
        {mode === "modify" && !!selectedMeasures.length && (
          <div className={classes.modifiable_measure}>
            <ModifiableMeasure
              measureIndex={selectedMeasures[0]}
              modificationBehavior={clickBehavior}
            />
          </div>
        )}
      </ReactModal> */}
    </>
  );
};

export default Workspace;
