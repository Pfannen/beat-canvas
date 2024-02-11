"use client";

import MusicProvider from "@/components/providers/music";
import DisplayMeasures from "@/components/ui/measure/display-measures";
import ModifiableMeasure from "@/components/ui/measure/segmented-measure/modifiable-measure";
import { clickBehavior } from "@/components/ui/measure/utils";
import classes from "./page.module.css";
import { useState } from "react";
import ReactModal from "react-modal";

export default function Home() {
  const [selectedMeasure, setSelectedMeasure] = useState<number>();
  return (
    <MusicProvider>
      <div className={classes.measures}>
        <DisplayMeasures onMeasureClick={setSelectedMeasure} />
      </div>
      <ReactModal
        isOpen={selectedMeasure !== undefined}
        onRequestClose={() => {
          setSelectedMeasure(undefined);
        }}
        shouldCloseOnOverlayClick={true}
      >
        {selectedMeasure !== undefined && (
          <div className={classes.modifiable_measure}>
            <ModifiableMeasure
              measureIndex={selectedMeasure}
              modificationBehavior={clickBehavior}
            />
          </div>
        )}
      </ReactModal>
    </MusicProvider>
  );
}
