import { NextResponse } from "next/server";
import { mongoGetAggregateStats } from "@/lib/mongoService";

export async function GET() {
  try {
    const stats = await mongoGetAggregateStats();
    return NextResponse.json({ success: true, stats });
  } catch (err: any) {
    console.error("Error in GET /api/stats:", err);
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
