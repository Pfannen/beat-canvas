export async function POST(request: Request) {
  const measures = request.body;

  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Disposition": "inline" },
  });
}
