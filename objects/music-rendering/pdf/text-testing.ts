import { PDFDocument, PageSizes, StandardFonts } from "pdf-lib";

const text = "Look at me";
const fontSize = 36;

export const drawPDFText = async () => {
  const pageSize = PageSizes.A4;
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.Courier);
  const width = timesRoman.widthOfTextAtSize(text, fontSize);
  timesRoman.heightAtSize(36);
  const centerX = (pageSize[0] - width) / 2;
  pdfDoc.addPage(pageSize);
  const page = pdfDoc.getPage(0);
  page.drawText(text, {
    font: timesRoman,
    y: pageSize[1] - fontSize,
    x: centerX,
    size: fontSize,
  });

  return pdfDoc.save();
};
