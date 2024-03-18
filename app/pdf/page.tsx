import { drawPDF, pdfToUrl } from "@/objects/music-rendering/pdf";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type PDFProps = {};

const PDF: FunctionComponent<PDFProps> = async () => {
  const pdf = await drawPDF();
  return (
    <iframe src={pdfToUrl(pdf)} width={"700px"} height={"1000px"}></iframe>
  );
};

export default PDF;
