export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "thumbnail";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const isVideo = type === "video";

    if (isVideo && !file.type.startsWith("video/")) {
      return Response.json({ error: "File must be a video" }, { status: 400 });
    }
    if (!isVideo && !file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }

    const maxSize = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json(
        { error: `File too large (max ${isVideo ? "200MB" : "10MB"})` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const prefix = isVideo ? "video" : "thumb";
    const bucket = isVideo ? "story-videos" : "story-images";
    const filename = `${prefix}-${Date.now()}.${ext}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json({ error: "Storage configuration missing" }, { status: 500 });
    }

    const buffer = await file.arrayBuffer();
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
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
      let message = "Failed to upload file";
      try {
        const json = JSON.parse(text);
        message = json.message || json.error || message;
      } catch {
        message = text || message;
      }
      return Response.json({ error: message }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
    return Response.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("[Video Upload]", error);
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
