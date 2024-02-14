"use client";

import ReactModal from "react-modal";
import DisplayMeasures from "../measure/display-measures";
import classes from "./index.module.css";
import { FunctionComponent, useState } from "react";
import ModifiableMeasure from "../measure/segmented-measure/modifiable-measure";
import { clickBehavior } from "../measure/utils";
import { useMusic } from "@/components/providers/music";
import {
  createMeasure,
  duplicateMeasures,
} from "@/components/providers/music/hooks/useMeasures/utils";
import useWorkSpace from "./hooks/useWorkspace";
import ControlButtons, { ControlButton } from "./control-buttons";

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
  const {
    getSelectedMeasures,
    isSelectedMeasures,
    onMeasureClick,
    isMeasureSelected,
  } = useWorkSpace();
  const { invokeMeasureModifier } = useMusic();
  const addMeasureHandler = () => {
    invokeMeasureModifier(createMeasure({}));
  };
  const duplicateMeasureHandler = () => {
    const selectedMeasures = getSelectedMeasures();
    if (selectedMeasures) {
      invokeMeasureModifier(
        duplicateMeasures({
          startIndex: selectedMeasures.start,
          count: selectedMeasures.end - selectedMeasures.start + 1,
        })
      );
    }
  };

  const buttons: ControlButton[] = [
    {
      label: "Add Measure",
      buttonProps: {
        onClick: addMeasureHandler,
        disabled: !isSelectedMeasures(),
      },
    },
    {
      label: "Duplicate Measures",
      buttonProps: {
        onClick: duplicateMeasureHandler,
        disabled: !isSelectedMeasures(),
      },
    },
    {
      label: "Modify",
      buttonProps: {
        onClick: () => {
          console.log("Hello");
        },
        disabled: !isSelectedMeasures(),
      },
    },
  ];

  return (
    <>
      <ControlButtons buttons={buttons} />
      <div className={classes.measures}>
        <DisplayMeasures
          onMeasureClick={onMeasureClick}
          className={classes.measure}
          isMeasureSelected={isMeasureSelected}
          selectedMeasureClassName={classes.selected}
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
