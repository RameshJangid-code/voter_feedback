import { NextRequest, NextResponse } from "next/server";
import { mongoGetSiteContent, mongoUpdateSiteContent } from "@/lib/mongoService";
import { isAdminIdentity, requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await mongoGetSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const body = await req.json();
    const { updates } = body;
    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid content update" }, { status: 400 });
    }
    const updated = await mongoUpdateSiteContent(updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("API error updating site content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
