import {
  Measure,
  Note,
  TimeSignature,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";
import { MeasureAttributes } from "@/types/music";
import { NoteAnnotation } from "@/types/music/note-annotations";
import { beamableSubdivisionLength } from "@/utils/music";

export interface ReadonlyMusic {
  getMeasureCount(): number;
  getMeasureNoteCount(measureIndex: number): number;
  getMeasureTimeSignature(measureIndex: number): TimeSignature;
  getMeasureAnnotations(measureIndex: number): Measure["attributes"];
  getMeasures(): Measure[];
  getMeasureNotes(measureIndex: number): Note[];
  getNoteData(
    measureIndex: number,
    noteIndex: number
  ): Omit<Note, "annotations">;
  noteHasAnnotation(
    measureIndex: number,
    noteIndex: number,
    annotation: NoteAnnotation
  ): boolean;
  getNoteDuration(measureIndex: number, noteIndex: number): number;
  getMeasureSubdivisionLength(measureIndex: number): number;
}

export class Music implements ReadonlyMusic {
  measures?: Measure[];

  checkMeasures() {
    if (!this.measures) {
      throw new Error("Music: Measures are not defined");
    }
  }

  isValidMeasureIndex(i: number) {
    return -1 < i && i < this.measures!.length;
  }

  isValidNoteIndex(notes: Measure["notes"], i: number) {
    return -1 < i && i < notes.length;
  }

  checkIndicies(measureIndex: number, noteIndex?: number): Measure {
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

  getMeasureAnnotations(
    measureIndex: number
  ): Partial<MeasureAttributes> | undefined {
    if (this.measures) {
      return { ...this.measures[measureIndex].attributes };
    }
    return undefined;
  }

  getMeasureTimeSignature(measureIndex: number): TimeSignature {
    return { beatsPerMeasure: 4, beatNote: 4 }; //Add time signauture data later
  }

  getMeasures(): Measure[] {
    if (!this.measures) return [];
    return this.measures.map((measure, i) => {
      return {
        attributes: { ...measure.attributes },
        notes: this.getMeasureNotes(i),
      };
    });
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

  noteHasAnnotation(
    measureIndex: number,
    noteIndex: number,
    annotation: NoteAnnotation
  ): boolean {
    const measure = this.checkIndicies(measureIndex, noteIndex);
    const annotations = measure.notes[noteIndex].annotations;
    return !!(annotations && annotations[annotation]);
  }

  getNoteDuration(measureIndex: number, noteIndex: number): number {
    const measure = this.checkIndicies(measureIndex, noteIndex);
    const note = measure.notes[noteIndex];
    return getNoteDuration(
      note.type,
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
}
