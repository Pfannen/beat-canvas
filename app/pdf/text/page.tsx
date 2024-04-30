import { FunctionComponent } from "react";
import { drawPDFText } from "@/objects/music-rendering/pdf/text-testing";
import { pdfToUrl } from "@/utils/import-export/export-pdf";

type PDFTextProps = {};

const PDFText: FunctionComponent<PDFTextProps> = async () => {
  const pdf = await drawPDFText();
  return <iframe src={pdfToUrl(pdf)} width={"100%"} height={"1000px"}></iframe>;
};

export default PDFText;
