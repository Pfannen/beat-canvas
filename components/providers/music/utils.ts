import { NoteType, TimeSignature } from "./types";

const noteTypeToFourFourValue: { [type in NoteType]: number } = {
  whole: 1,
  half: 2,
  quarter: 4,
  eighth: 8,
  sixteenth: 16,
  thirtysecond: 32,
  sixtyfourth: 64,
};

export const getNoteDuration = (
  noteType: NoteType,
  beatNote: number,
  dotted = false
) => {
  let duration = +(beatNote / noteTypeToFourFourValue[noteType]);
  if (dotted) duration += duration / 2;
  return duration;

  /* return +(beatNote / noteTypeToFourFourValue[noteType]).toFixed(
		3
	) as SegmentBeat; //toFixed 3 works except for dotted-thirtysecond (rounds it to .188 for 4/4 but needs to be .1875) */
};

export const getRestDuration = (
  noteType: NoteType,
  timeSignature: TimeSignature,
  dotted = false
) => {
  if (noteType === "whole") return timeSignature.beatsPerMeasure;
  return getNoteDuration(noteType, timeSignature.beatNote, dotted);
};

export const getNotePercentageOfMeasure = (
  noteType: NoteType,
  timeSignature: TimeSignature,
  dotted = false
) => {
  const duration = getNoteDuration(noteType, timeSignature.beatNote, dotted);
  return {
    duration,
    percentageOfMeasure: duration / timeSignature.beatsPerMeasure,
  };
};
