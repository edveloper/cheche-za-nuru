export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "File must be less than 10MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `gallery-${Date.now()}.${ext}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json({ error: "Storage configuration missing" }, { status: 500 });
    }

    const buffer = await file.arrayBuffer();
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/story-images/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": file.type,
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      let message = "Failed to upload image";
      try {
        const json = JSON.parse(text);
        message = json.message || json.error || message;
      } catch {
        message = text || message;
      }
      return Response.json({ error: message }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/story-images/${filename}`;
    return Response.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("[Gallery Upload]", error);
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
