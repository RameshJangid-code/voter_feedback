import { NextResponse } from "next/server";
import { mongoGetActivePoll } from "@/lib/mongoService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activePoll = await mongoGetActivePoll();
    return NextResponse.json({ success: true, activePoll });
  } catch (error) {
    console.error("Error fetching active poll:", error);
    return NextResponse.json({ error: "Failed to fetch active poll" }, { status: 500 });
  }
}
