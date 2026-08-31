export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return Response.json({ message: "No file uploaded" }, { status: 400 });
    }

    return Response.json({ imageUrl });
  } catch (error: any) {
    return Response.json({ message: "Upload failed", error: error.message }, { status: 500 });
  }
}
