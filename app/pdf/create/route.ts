import { MusicScore } from "@/types/music";
import { createPDFFromScore } from "@/utils/import-export/export-pdf";

export async function POST(request: Request) {
  const measures = (await request.json()) as MusicScore;

  const pdf = await createPDFFromScore(measures);

  return new Response(pdf, {
    status: 200,
    headers: {
      "content-disposition": `inline; filename=test.pdf`,
      "content-type": "application/pdf",
    },
  });
}
