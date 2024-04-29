import { Measure } from "@/components/providers/music/types";
import { createPDFFromMeasures } from "@/utils/import-export/export-pdf";

export async function POST(request: Request) {
  const measures = (await request.json()) as Measure[];

  const pdf = await createPDFFromMeasures(measures);

  return new Response(pdf, {
    status: 200,
    headers: {
      "content-disposition": `inline; filename=test.pdf`,
      "content-type": "application/pdf",
    },
  });
}
