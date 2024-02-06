"use client";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { MeasureProps, Segment, SegmentGenerator } from "./types";
import useLinkedListState from "@/components/hooks/useLinkedListState";
import {
  KeySignature,
  Note,
  SegmentBeat,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";

const Measure: FunctionComponent<MeasureProps> = ({
  segmentGenerator,
  renderSegment,
  addNote,
  notes,
  keySignature,
}) => {
  const [segments, updateEnv, iterateSegments] = useLinkedListState(() => {
    return generateSegments(segmentGenerator, notes, keySignature);
  });
  const onAddNote = (segment: Segment) => (note: Note) => {
    console.log(segment);
    //validate note placement
    //if valid, update state...
    addNote(note);
    updateEnv(() => {
      segment.data.notes = [note];
    });
  };
  return (
    <div className={classes.measure}>
      {iterateSegments((segment) => {
        const { beatPercentage, notes, xPos } = segment.data;
        return renderSegment({
          beatPercentage,
          notes,
          xPos,
          width: beatPercentage / keySignature.beatsPerMeasure,
          noteValidator: (x, y, t) => true,
          onNotePlaced: onAddNote(segment),
          onNoteRemoved: (y) => console.log(y),
        });
      })}
    </div>
  );
};

export default Measure;

const generateSegments = (
  segmentGenerator: SegmentGenerator,
  notes: Note[],
  keySignature: KeySignature
) => {
  let segmentList: Segment | undefined = undefined;
  //Start from the end of the measure and build to the front
  let xPosition = keySignature.beatsPerMeasure;
  for (let i = notes.length - 1; i > -1; i--) {
    const notePercentage = getNoteDuration(
      notes[i].type,
      keySignature.beatNote
    );
    segmentList = getSegmentsBetween(
      segmentGenerator,
      notes[i].x + notePercentage,
      xPosition,
      segmentList
    );
    segmentList = getNoteSegment(notes[i], notePercentage, segmentList);
    xPosition = notes[i].x;
  }
  return getSegmentsBetween(
    segmentGenerator,
    0,
    xPosition,
    segmentList
  ) as Segment;
};

const getSegmentsBetween = (
  segmentGenerator: SegmentGenerator,
  xPosFrom: number,
  xPosTo: number,
  segmentList: Segment | undefined
) => {
  const { segments, segmentOrder } = segmentGenerator(xPosFrom, xPosTo);
  const keys = Object.keys(segments);
  if (segmentOrder) {
    keys.sort((a, b) => {
      return segmentOrder === "increasing" ? +b - +a : +a - +b; //This is actually opposite of what "segmentOrder" specifies because the segments will be created backwards
    });
  }
  let currentXPos = xPosTo;
  keys.forEach((key) => {
    const beatPercentage = +key as SegmentBeat;
    const numSegments = segments[beatPercentage]!;
    for (let j = 0; j < numSegments; j++) {
      currentXPos -= beatPercentage;
      const xPos = currentXPos;
      const data: Segment["data"] = {
        xPos,
        beatPercentage,
      };
      const segment: Segment = { data };
      prependSegment(segment, segmentList);
      segmentList = segment;
    }
  });
  return segmentList;
};

const getNoteSegment = (
  note: Note,
  notePercentage: SegmentBeat,
  segmentList: Segment | undefined
) => {
  const noteData: Segment["data"] = {
    xPos: note.x,
    beatPercentage: notePercentage,
    notes: [note],
  };
  const noteSegment: Segment = { data: noteData };
  prependSegment(noteSegment, segmentList);
  segmentList = noteSegment;
  return segmentList;
};

const prependSegment = (
  headSegment: Segment,
  segmentList: Segment | undefined
) => {
  headSegment.next = segmentList;
  if (headSegment.next) {
    headSegment.next.prev = headSegment;
  }
};
