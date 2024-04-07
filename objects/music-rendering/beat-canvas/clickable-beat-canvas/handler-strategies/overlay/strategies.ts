import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import {
  ClickDelegate,
  ClickableOverlayContext,
  MeasureIdentifier,
  NoteClickDel,
  NoteIdentifier,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { ClickableOverlay } from ".";

export class MeasureOverlay extends ClickableOverlay<MeasureIdentifier> {
  private onMeasureClick: ClickDelegate;
  constructor(
    drawRectangle: ReactDrawingCanvas["drawRectangle"],
    onMeasureClick: ClickDelegate
  ) {
    super(drawRectangle);
    this.onMeasureClick = onMeasureClick;
  }
  createOverlay(context: ClickableOverlayContext<MeasureIdentifier>): void {
    const onClick = this.onMeasureClick.bind(
      null,
      context.indentifiers.measureIndex
    );
    this.drawOverlay(context, onClick);
  }
}

export class NoteOverlay extends ClickableOverlay<NoteIdentifier> {
  private onNoteClick: NoteClickDel;
  constructor(
    drawRectangle: ReactDrawingCanvas["drawRectangle"],
    onNoteClick: NoteClickDel
  ) {
    super(drawRectangle);
    this.onNoteClick = onNoteClick;
  }
  createOverlay(context: ClickableOverlayContext<NoteIdentifier>): void {
    const onClick = this.onNoteClick.bind(
      null,
      context.indentifiers.measureIndex,
      context.indentifiers.noteIndex
    );
    this.drawOverlay(context, onClick);
  }
}
