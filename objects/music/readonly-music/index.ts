import {
  Measure,
  Note,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";
import { NoteDirection } from "@/lib/notes/types";
import {
  NoteAnnotation,
  NoteAnnotations,
} from "@/types/music/note-annotations";
import {
  beamableSubdivisionLength,
  restSubdivisionLength,
} from "@/utils/music";

export interface ReadonlyMusic {
  getMeasureCount(): number;
  getMeasureNoteCount(measureIndex: number): number;
  getMeasureTimeSignature(measureIndex: number): TimeSignature;
  getMeasureAnnotations(measureIndex: number): Measure["staticAttributes"];
  getRestDuration(measureIndex: number, type: NoteType): number;
  // getMeasures(): Measure[];
  getMeasureNotes(measureIndex: number): Note[];
  getNoteData(
    measureIndex: number,
    noteIndex: number
  ): Omit<Note, "annotations">;
  getNoteAnnotations(
    measureIndex: number,
    noteIndex: number
  ): NoteAnnotations | undefined;
  getNoteDuration(measureIndex: number, noteIndex: number): number;
  getNoteDirection(measureIndex: number, noteIndex: number): NoteDirection;
  getMeasureSubdivisionLength(measureIndex: number): number;
  getRestSubdivisionLength(measureIndex: number): number;
}

export class Music implements ReadonlyMusic {
  constructor(
    private measures: Measure[],
    private getMeasureTimeSig: (measureIndex: number) => TimeSignature
  ) {}

  private checkMeasures() {
    if (!this.measures) {
      throw new Error("Music: Measures are not defined");
    }
  }

  private isValidMeasureIndex(i: number) {
    return -1 < i && i < this.measures!.length;
  }

  private isValidNoteIndex(notes: Measure["notes"], i: number) {
    return -1 < i && i < notes.length;
  }

  private checkIndicies(measureIndex: number, noteIndex?: number): Measure {
    this.checkMeasures();
    if (!this.isValidMeasureIndex(measureIndex)) {
      throw new Error(
        `Music: Invalid measure index. Received index: ${measureIndex}`
      );
    }
    const measure = this.measures![measureIndex];
    if (
      noteIndex !== undefined &&
      !this.isValidNoteIndex(measure.notes, noteIndex)
    ) {
      throw new Error(
        `Music: Invalid note index. Received measure index: ${measureIndex} and note index: ${noteIndex}`
      );
    }
    return measure;
  }

  getMeasureCount(): number {
    return this.measures?.length || 0;
  }

  getMeasureNoteCount(measureIndex: number): number {
    if (!this.measures) return 0;
    return this.measures[measureIndex].notes.length;
  }

  getMeasureAnnotations(measureIndex: number): Measure["staticAttributes"] {
    if (this.measures) {
      return this.measures[measureIndex].staticAttributes;
    }
    return undefined;
  }

  getMeasureTimeSignature(measureIndex: number): TimeSignature {
    return this.getMeasureTimeSig(measureIndex);
  }

  getMeasures(): Measure[] {
    return this.measures || [];
  }

  getMeasureNotes(measureIndex: number): Note[] {
    if (!this.measures![measureIndex]) return [];
    return this.measures![measureIndex].notes.map((note) => {
      const annotations = { ...note.annotations };
      return { ...note, annotations };
    });
  }

  getNoteData(
    measureIndex: number,
    noteIndex: number
  ): Omit<Note, "annotations"> {
    const measure = this.checkIndicies(measureIndex, noteIndex);
    const note = measure.notes[noteIndex];
    return { x: note.x, y: note.y, type: note.type };
  }

  getNoteAnnotations(measureIndex: number, noteIndex: number) {
    const measure = this.checkIndicies(measureIndex, noteIndex);
    return measure.notes[noteIndex].annotations;
  }

  getNoteDuration(measureIndex: number, noteIndex: number): number {
    const measure = this.checkIndicies(measureIndex, noteIndex);
    const note = measure.notes[noteIndex];
    return getNoteDuration(
      note.type,
      this.getMeasureTimeSignature(measureIndex).beatNote,
      measure.notes[noteIndex].annotations?.dotted
    );
  }

  getRestDuration(measureIndex: number, type: NoteType): number {
    return getNoteDuration(
      type,
      this.getMeasureTimeSignature(measureIndex).beatNote
    );
  }

  setMeasures(measures: Measure[]) {
    this.measures = measures;
  }

  getMeasureSubdivisionLength(measureIndex: number): number {
    return beamableSubdivisionLength(
      this.getMeasureTimeSignature(measureIndex)
    );
  }

  getRestSubdivisionLength(measureIndex: number): number {
    return restSubdivisionLength(this.getMeasureTimeSignature(measureIndex));
  }

  getNoteDirection(measureIndex: number, noteIndex: number): NoteDirection {
    const measure = this.measures![measureIndex];
    const note = measure.notes[noteIndex];
    return note.y < 4 ? "up" : "down";
  }
}
