"use client";

import MusicProvider from "@/components/providers/music";
import DisplayMeasure from "@/components/ui/measure/display-measure";
import classes from "./page.module.css";

export default function Home() {
  return (
    <MusicProvider>
      <div className={classes.measures}>
        <DisplayMeasure componentsAbove={2} componentsBelow={2} />
      </div>
    </MusicProvider>
  );
}

{
  /* <Note />
      <Measure
        segmentGenerator={minimalSegmentGenerator}
        notes={[{ x: 1.5, type: "eighth", y: 0 }]}
        timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
        renderSegment={(props) => (
          <SplitSegment {...props} lineHeight="10px" spaceHeight="20px" />
        )}
        addNote={(note) => {
          console.log(note);
        }}
        removeNote={(x, y) => {
          console.log(x, y);
        }}
      /> */
}
