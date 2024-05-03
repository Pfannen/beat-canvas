import { MusicPart, MusicScore } from "@/types/music";
import {
  appendElement,
  appendElements,
  createIdentificationEl,
  createMusicXMLDocument,
  createPartListEl,
  createTitleEl,
  createXMLElement,
} from "./utils";
import { noteAttributeGenerator } from "@/utils/music/measures/traversal";
import { noteEC, restsEC } from "./note-helpers";
import { attributesEC } from "./measure-helpers";

const createMeasureElement = (index: number) => {
  const el = createXMLElement("measure");
  el.setAttribute("number", index.toString());
  return el;
};

const createPartElement = (partId: string) => {
  const partElement = createXMLElement("part");
  partElement.setAttribute("id", partId);
  return partElement;
};

const partEC = (part: MusicPart) => {
  const partElement = createPartElement(part.attributes.id);

  let measureElement: Element | null = null;
  for (const locObj of noteAttributeGenerator(part.measures)) {
    const {
      measureStart,
      measureEnd,
      measureIndex,
      note,
      newAttributes,
      currentAttributes,
      curX,
      lastNoteXEnd,
    } = locObj;
    const { timeSignature, clef } = currentAttributes;

    if (measureStart) {
      if (measureElement) appendElement(partElement, measureElement);
      measureElement = createMeasureElement(measureIndex);
    }

    if (newAttributes) {
      appendElements(measureElement!, attributesEC(newAttributes));
    }

    if (note) {
      // If rests need to be generated (might not always be the case)
      if (lastNoteXEnd !== curX) {
        appendElements(
          measureElement!,
          restsEC(lastNoteXEnd, curX, timeSignature)
        );
      }

      // Create the current note
      appendElement(
        measureElement!,
        noteEC(note, timeSignature.beatNote, clef)
      );
    }

    if (measureEnd && lastNoteXEnd !== curX) {
      appendElements(
        measureElement!,
        restsEC(lastNoteXEnd, curX, timeSignature)
      );
    }
  }

  if (measureElement) appendElement(partElement, measureElement);

  return partElement;
};

export const createMusicXMLScore = (score: MusicScore) => {
  const [root, scoreEl] = createMusicXMLDocument();
  // Add identification
  appendElement(scoreEl, createIdentificationEl());
  // Add title
  appendElement(scoreEl, createTitleEl(score.title));
  // Add part list
  appendElement(scoreEl, createPartListEl(score.parts));

  // Add each part
  for (const part of score.parts) {
    appendElement(scoreEl, partEC(part));
  }

  // We always use 1 for the divisions
  // Find the first attributes element and insert the divisions into it
  const divisionsEl = createXMLElement("divisions");
  divisionsEl.textContent = "1";
  const firstAttrEl = scoreEl.querySelector("attributes");
  if (firstAttrEl) firstAttrEl.appendChild(divisionsEl);

  return root;
};
