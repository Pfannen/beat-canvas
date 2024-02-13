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

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
  const [selectedMeasures, setSelectedMeasures] = useState<number[]>([]);
  const [mode, setMode] = useState<"modify" | "create">("create");
  const { invokeMeasureModifier } = useMusic();
  const modeHandler = () => {
    setMode((prevMode) => {
      return prevMode === "create" ? "modify" : "create";
    });
    setSelectedMeasures([]);
  };
  const addMeasureHandler = () => {
    invokeMeasureModifier(createMeasure({}));
  };
  const duplicateMeasureHandler = () => {
    if (selectedMeasures.length) {
      invokeMeasureModifier(
        duplicateMeasures({
          startIndex: selectedMeasures[0],
          count: selectedMeasures.length,
        })
      );
    }
  };
  const measureSelectedHandler = (index: number) => {
    setSelectedMeasures((prevState) => {
      const idx = prevState.findIndex((val) => val === index);
      if (idx === -1) {
        return [...prevState, index];
      } else {
        const cpy = [...prevState];
        cpy.splice(idx, 1);
        return cpy;
      }
    });
  };

  return (
    <>
      <button onClick={modeHandler}>
        Enter {mode === "create" ? "Modify" : "Create"} Mode
      </button>
      <div>
        <button onClick={addMeasureHandler}>Add New Measure</button>
        <button onClick={duplicateMeasureHandler}>Duplicate Measures</button>
      </div>
      <div className={classes.measures}>
        <DisplayMeasures
          onMeasureClick={measureSelectedHandler}
          className={classes.measure}
          selectedMeasures={selectedMeasures}
          selectedMeasureClassName={classes.selected}
        />
      </div>
      <ReactModal
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
      </ReactModal>
    </>
  );
};

export default Workspace;
