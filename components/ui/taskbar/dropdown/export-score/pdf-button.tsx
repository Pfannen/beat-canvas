import MP3SVG from "@/components/ui/svg/mp3";
import { FunctionComponent } from "react";
import { Measure } from "@/components/providers/music/types";

type ExportPDFButtonProps = {
  measures?: Measure[];
};

const ExportPDFButton: FunctionComponent<ExportPDFButtonProps> = ({
  measures,
}) => {
  const getPDF = async () => {
    if (measures) {
      const res = await fetch("/pdf/create", {
        method: "POST",
        body: JSON.stringify(measures),
      });
      const data = await res.blob();
      const url = URL.createObjectURL(data);
      window.open(url, "_blank");
    }
  };
  return (
    <button onClick={getPDF}>
      PDF
      <MP3SVG />
    </button>
  );
};

export default ExportPDFButton;
