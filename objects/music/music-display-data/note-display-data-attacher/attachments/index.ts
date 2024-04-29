import { attachBeamData } from "./beam-attachment";
import { attachNonBodyData } from "./non-body-attachment";
import { DisplayDataAttachmentContext } from "./types";

export type Attacher = keyof typeof attachments;

export type AttacherArgs<T extends Attacher> = Parameters<
  (typeof attachments)[T]
>[0] extends DisplayDataAttachmentContext
  ? undefined
  : Parameters<(typeof attachments)[T]>[0];

export const attachments = {
  "beam-data": attachBeamData,
  "non-body": attachNonBodyData,
};

export const getAttacher = (attacher: Attacher) => attachments[attacher];
