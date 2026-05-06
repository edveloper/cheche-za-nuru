export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const timestamp = Date.now();
    const filename = `team-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "Storage configuration missing" },
        { status: 500 }
      );
    }

    const buffer = await file.arrayBuffer();
    const uploadUrl = `${supabaseUrl}/storage/v1/object/team-photos/${filename}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "x-upsert": "false",
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      console.error("Upload error:", error);
      return Response.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Generate public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/team-photos/${filename}`;

    return Response.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
