import { NextRequest, NextResponse } from "next/server";

import {
  mongoGetPostVoteDetails,
  mongoInsertPostVoteDetail,
} from "@/lib/mongoService";
import { PostVoteDetail } from "@/types";
import { isAdminIdentity, requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// GET — admin only: retrieve all voluntary post-vote details
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const list = await mongoGetPostVoteDetails();
    return NextResponse.json({ success: true, count: list.length, voters: list });
  } catch (err: unknown) {
    console.error("Error in GET /api/voters:", err);
    return NextResponse.json({ error: "Failed to fetch registered voters" }, { status: 500 });
  }
}

// POST — public: save voluntary post-vote personal details
// These are STRICTLY decoupled from the anonymous vote/opinion record.
// No vote preference (yes/no) is stored here alongside PII.
// The voteChoiceLabel is an admin convenience label only; it is NOT linked to the anonymous opinion ID by default.
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

    // At least one meaningful contact field must be provided
    const hasData =
      (fullName && typeof fullName === "string" && fullName.trim()) ||
      (mobileNumber && typeof mobileNumber === "string" && mobileNumber.trim());

    if (!hasData) {
      return NextResponse.json(
        { error: "कृपया कम से कम अपना नाम या मोबाइल नंबर दर्ज करें।" },
        { status: 400 }
      );
    }

    const id = `pvd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    const newDetail: PostVoteDetail = {
      id,
      relatedSurveyId: typeof relatedSurveyId === "string" ? relatedSurveyId.slice(0, 100) : undefined,
      pollId: typeof pollId === "string" ? pollId.slice(0, 100) : undefined,
      pollOptionId: typeof pollOptionId === "string" ? pollOptionId.slice(0, 100) : undefined,
      voteChoiceLabel: typeof voteChoiceLabel === "string" ? voteChoiceLabel.slice(0, 100) : undefined,
      fullName: typeof fullName === "string" ? fullName.trim().slice(0, 100) : "",
      fatherName: typeof fatherName === "string" ? fatherName.trim().slice(0, 100) : "",
      mobileNumber: typeof mobileNumber === "string" ? mobileNumber.trim().slice(0, 20) : "",
      locality: typeof locality === "string" ? locality.trim().slice(0, 100) : "",
      notes: typeof notes === "string" ? notes.trim().slice(0, 500) : "",
      createdAt: timestamp,
      isDemo: false,
    };

    await mongoInsertPostVoteDetail(newDetail);

    return NextResponse.json({
      success: true,
      id,
      message: "आपकी जानकारी सफलतापूर्वक सुरक्षित कर ली गई है।",
    });
  } catch (err: unknown) {
    console.error("Error in POST /api/voters:", err);
    return NextResponse.json({ error: "जानकारी सुरक्षित करने में त्रुटि आई।" }, { status: 500 });
  }
}
