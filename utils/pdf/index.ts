"use server";

import * as fs from "fs";
import * as path from "path";
import { PDFDocument } from "pdf-lib";

export const embedCustomFont = async (fileName: string, doc: PDFDocument) => {
  const fontBytes = fs.readFileSync(
    path.join(__dirname, "../../../public/fonts", fileName)
  );
  return await doc.embedFont(fontBytes);
};
