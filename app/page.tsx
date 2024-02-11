"use client";

import MusicProvider from "@/components/providers/music";
import ModifiableMeasure from "@/components/ui/measure/segmented-measure/modifiable-measure";
import { clickBehavior } from "@/components/ui/measure/utils";

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
