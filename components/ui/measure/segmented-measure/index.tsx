"use client";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import { Segment, SegmentGenerator, SegmentRenderer } from "../types";
import {
  TimeSignature,
  Note,
  SegmentBeat,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";

export type MeasureProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: SegmentRenderer;
  notes: Note[];
  // addNote: (note: Note) => void;
  // removeNote: (xPos: number, yPos: number) => void;
  timeSignature: TimeSignature;
};

const Measure: FunctionComponent<MeasureProps> = ({
  segmentGenerator,
  renderSegment,
  notes,
  timeSignature,
}) => {
  // const [segments, updateEnv, iterateSegments] = useLinkedListState(() => {
  //   return generateSegments(segmentGenerator, notes, timeSignature);
  // });
  // const onAddNote = (segment: Segment) => (note: Note) => {
  //   console.log(segment);
  //   //validate note placement
  //   //if valid, update state...
  //   addNote(note);
  //   updateEnv(() => {
  //     segment.data.notes = [note];
  //   });
  // };
  const segments = generateSegments(segmentGenerator, notes, timeSignature);
  const reduceNodes = (reducer: (cell: Segment) => ReactNode) => {
    const data = [];
    let currNode: Segment | undefined = segments;
    while (currNode) {
      data.push(reducer(currNode));
      currNode = currNode.next;
    }
    return data;
  };
  return (
    <div className={classes.measure}>
      {reduceNodes((segment) => {
        const { beatPercentage, notes, xPos } = segment.data;
        return renderSegment({
          beatPercentage,
          notes,
          xPos,
          width: beatPercentage / timeSignature.beatsPerMeasure,
        });
      })}
    </div>
  );
};

export default Measure;

//Start from the end of the measure and builds to the front
const generateSegments = (
  segmentGenerator: SegmentGenerator,
  notes: Note[],
  timeSignature: TimeSignature
) => {
  let segmentList: Segment | undefined = undefined; //The head of the segment list

  let xPosition = timeSignature.beatsPerMeasure; //The current starting position (initially the end of the measure)
  for (let i = notes.length - 1; i > -1; i--) {
    const noteDuartion = getNoteDuration(notes[i].type, timeSignature.beatNote); //How long the note lasts (how much space it takes up on the x-axis)
    segmentList = getSegmentsBetween(
      segmentGenerator,
      notes[i].x + noteDuartion,
      xPosition,
      segmentList
    ); //Append the segments between the end of the current note and the current x position
    segmentList = getNoteSegment(notes[i], noteDuartion, segmentList); //Append the note segment
    xPosition = notes[i].x;
  }
  return getSegmentsBetween(
    segmentGenerator,
    0,
    xPosition,
    segmentList
  ) as Segment; //Append the segments that make up the rest of the measure (from 0 (the start of the measure) to where the first note starts (which is stored in xPosition))
};

const getSegmentsBetween = (
  segmentGenerator: SegmentGenerator,
  xPosFrom: number,
  xPosTo: number,
  segmentList: Segment | undefined
) => {
  const segmentCounts = segmentGenerator(xPosFrom, xPosTo); //Call the segment generator to know how many of each segment to render
  let currentXPos = xPosTo; //The current x position for the current segment being added
  segmentCounts.forEach(({ segmentBeat, count }) => {
    //Iterate over all of the segments for this segment beat
    for (let j = 0; j < count; j++) {
      currentXPos -= segmentBeat; //Subtract the segment beat to calculate where this segment starts
      const data: Segment["data"] = {
        xPos: currentXPos,
        beatPercentage: segmentBeat,
      };
      const segment: Segment = { data }; //Create a new segment cell
      prependSegment(segment, segmentList); //Prepend the cell to the segment list (this will take care of the next and prev pointers)
      segmentList = segment; //Set the segment list equal to the newest segment (since the list is being built backwards)
    }
  });
  return segmentList;
};

const getNoteSegment = (
  note: Note,
  noteDuartion: SegmentBeat,
  segmentList: Segment | undefined
) => {
  const noteData: Segment["data"] = {
    xPos: note.x,
    beatPercentage: noteDuartion,
    notes: [note],
  };
  const noteSegment: Segment = { data: noteData }; //Create a new segment cell for the note
  prependSegment(noteSegment, segmentList); //Prepend the cell to the segment list
  noteSegment;
  return noteSegment;
};

const prependSegment = (cell: Segment, segmentList: Segment | undefined) => {
  cell.next = segmentList; //Set the cell's next pointer to the segment list
  if (segmentList) {
    segmentList.prev = cell; //If there were already segments in the list, update the prev pointer of the segment list to the new head node
  }
};
