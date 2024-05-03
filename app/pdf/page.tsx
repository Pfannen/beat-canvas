import { drawPDF } from "@/objects/music-rendering/pdf";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { pdfToUrl } from "@/utils/import-export/export-pdf";

type PDFProps = {};

const PDF: FunctionComponent<PDFProps> = async () => {
  const pdf = await drawPDF();
  return <iframe src={pdfToUrl(pdf)} width={"100%"} height={"1000px"}></iframe>;
};

export default PDF;
