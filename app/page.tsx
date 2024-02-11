"use client";

import MusicProvider from "@/components/providers/music";
import DisplayMeasures from "@/components/ui/measure/display-measures";
import ModifiableMeasure from "@/components/ui/measure/segmented-measure/modifiable-measure";
import { clickBehavior } from "@/components/ui/measure/utils";
import classes from "./page.module.css";

export default function Home() {
  return (
    <MusicProvider>
      {/* <div className={classes.measures}>
        <DisplayMeasures />
      </div> */}
      <ModifiableMeasure
        measureIndex={0}
        modificationBehavior={clickBehavior}
      />
    </MusicProvider>
  );
}
