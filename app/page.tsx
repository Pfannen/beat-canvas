"use client";

import MusicProvider from "@/components/providers/music";
import DisplayMeasure from "@/components/ui/measure/display-measures/display-measure";
import classes from "./page.module.css";
import DisplayMeasures from "@/components/ui/measure/display-measures";
import Note from "@/components/ui/measure/note";
import Measure from "@/components/ui/measure/modifiable-measure";
import { minimalSegmentGenerator } from "@/components/ui/reusable/segment-split/utils";
import SplitSegment from "@/components/ui/measure/segment/split-segment";

export default function Home() {
  return (
    // <MusicProvider>
    //   <div className={classes.measures}>
    //     <DisplayMeasures />
    //   </div>
    // </MusicProvider>
    <div className={classes.measures}>
      {/* <Note /> */}
      <Measure
        segmentGenerator={minimalSegmentGenerator}
        notes={[{ x: 1.5, type: "eighth", y: 0 }]}
        timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
        renderSegment={(props) => <SplitSegment {...props} />}
        addNote={(note) => {
          console.log(note);
        }}
        removeNote={(x, y) => {
          console.log(x, y);
        }}
      />
    </div>
  );
}

{
}
