"use client";

import ReactModal from "react-modal";
import DisplayMeasures from "../measure/display-measures";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import ModifiableMeasures from "../measure/segmented-measure/modifiable-measures";
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
        onClick: ws.mode.set.bind(null, "duplicate"),
        disabled: !ws.isSelectedMeasures(),
      },
    },
    {
      label: "Modify",
      buttonProps: {
        onClick: ws.mode.set.bind(null, "modify"),
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

  const modalShouldOpen = ws.mode.get() === "modify" && ws.isSelectedMeasures();

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
      <ReactModal
        isOpen={modalShouldOpen}
        onRequestClose={ws.mode.clear}
        shouldCloseOnOverlayClick={true}
      >
        {modalShouldOpen && (
          <div className={classes.modifiable_measure}>
            <ModifiableMeasures
              measureIndex={ws.getSelectedMeasures()!.start} //ws.isSelectedMeasures is true
              count={ws.getSelectedCount()}
              modificationBehavior={clickBehavior}
            />
          </div>
        )}
      </ReactModal>
    </>
  );
};

export default Workspace;
