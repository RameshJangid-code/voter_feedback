import { NextRequest, NextResponse } from "next/server";
import { mongoGetPostVoteDetails, mongoInsertPostVoteDetail } from "@/lib/mongoService";
import { PostVoteDetail } from "@/types";

export async function GET() {
  try {
    const list = await mongoGetPostVoteDetails();
    return NextResponse.json({ success: true, count: list.length, voters: list });
  } catch (err: any) {
    console.error("Error in GET /api/voters:", err);
    return NextResponse.json({ error: "Failed to fetch registered voters" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      relatedSurveyId,
      pollId,
      pollOptionId,
      voteChoiceLabel,
      fullName,
      fatherName,
      mobileNumber,
      locality,
      notes,
    } = body;

    const timestamp = new Date().toISOString();
    const id = `pvd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newDetail: PostVoteDetail = {
      id,
      relatedSurveyId: relatedSurveyId || undefined,
      // Link to the poll and option so admin can see what this person voted for
      pollId: pollId || undefined,
      pollOptionId: pollOptionId || undefined,
      voteChoiceLabel: voteChoiceLabel || undefined,
      fullName: (fullName || "").trim(),
      fatherName: (fatherName || "").trim(),
      mobileNumber: (mobileNumber || "").trim(),
      locality: (locality || "").trim(),
      notes: (notes || "").trim(),
      createdAt: timestamp,
      isDemo: false,
    };

    await mongoInsertPostVoteDetail(newDetail);

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("Error in POST /api/voters:", err);
    return NextResponse.json({ error: "Failed to save voter details" }, { status: 500 });
  }
}
