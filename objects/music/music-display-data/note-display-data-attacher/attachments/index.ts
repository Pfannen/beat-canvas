import { attachBeamData } from "./beam-attachment";
import { DisplayDataAttachmentContext } from "./types";

export type Attacher = keyof typeof attachments;

export type AttacherArgs<T extends Attacher> = Parameters<
  (typeof attachments)[T]
>[0] extends DisplayDataAttachmentContext
  ? undefined
  : Parameters<(typeof attachments)[T]>[0];

export const attachments = {
  "beam-data": attachBeamData,
  tester: (obj: DisplayDataAttachmentContext) => {},
};

export const getAttacher = (attacher: Attacher) => attachments[attacher];
