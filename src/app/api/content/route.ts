import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/dataService";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates, adminEmail } = body;
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin email required" }, { status: 401 });
    }
    const updated = await updateSiteContent(updates, adminEmail);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
