import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { mongoGetAllFeedback, mongoInsertFeedback, mongoInsertContactRequest } from "@/lib/mongoService";
import { ProblemCategory, ProblemPriority, PublicFeedback, FollowupRequest } from "@/types";
import { isAdminIdentity, requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includePrivate = searchParams.get("all") === "true";
    if (includePrivate) {
      const admin = await requireAdmin(req);
      if (!isAdminIdentity(admin)) return admin;
    }
    const feedbackList = await mongoGetAllFeedback(includePrivate);
    return NextResponse.json({ success: true, count: feedbackList.length, feedback: feedbackList });
  } catch (err: unknown) {
    console.error("Error in GET /api/feedback:", err);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category,
      description,
      suggestedImprovement,
      priority,
      ward,
      villageDevelopmentSuggestion,
      followup,
    } = body;

    // Server-side validation
    const validCategories: ProblemCategory[] = [
      "water",
      "roads",
      "drainage",
      "streetlights",
      "education",
      "health",
      "employment",
      "govSchemes",
      "cleanliness",
      "other",
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "अमान्य समस्या श्रेणी।" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { error: "समस्या का विवरण कम से कम 10 अक्षरों में आवश्यक है।" },
        { status: 400 }
      );
    }

    if (description.trim().length > 1500) {
      return NextResponse.json(
        { error: "विवरण की अधिकतम सीमा (1500 अक्षर) पार हो गई है।" },
        { status: 400 }
      );
    }

    if (
      typeof suggestedImprovement !== "string" ||
      suggestedImprovement.trim().length < 5 ||
      suggestedImprovement.length > 1500 ||
      (ward !== undefined && (typeof ward !== "string" || ward.length > 100)) ||
      (villageDevelopmentSuggestion !== undefined &&
        (typeof villageDevelopmentSuggestion !== "string" || villageDevelopmentSuggestion.length > 1500))
    ) {
      return NextResponse.json({ error: "कृपया समस्या का मान्य सुझाव और स्थान दर्ज करें।" }, { status: 400 });
    }

    if (
      followup !== undefined &&
      (!followup ||
        typeof followup !== "object" ||
        followup.consentToContact !== true ||
        typeof (followup.mobileNumber || followup.contactPhone) !== "string" ||
        (followup.mobileNumber || followup.contactPhone).trim().length < 8)
    ) {
      return NextResponse.json({ error: "संपर्क विवरण के लिए वैध सहमति और मोबाइल नंबर आवश्यक है।" }, { status: 400 });
    }

    const validPriorities: ProblemPriority[] = ["low", "medium", "high"];
    const checkedPriority: ProblemPriority = validPriorities.includes(priority)
      ? priority
      : "medium";

    const timestamp = new Date().toISOString();
    const feedbackId = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newFeedback: PublicFeedback = {
      feedbackId,
      category,
      description: description.trim(),
      suggestedImprovement: (suggestedImprovement || "").trim(),
      priority: checkedPriority,
      ward: (ward || "").trim(),
      villageDevelopmentSuggestion: (villageDevelopmentSuggestion || "").trim(),
      moderationStatus: "approved",
      status: "pending",
      createdAt: timestamp,
      isPublic: true,
      isDemo: false,
    };

    // Save directly to MongoDB
    await mongoInsertFeedback(newFeedback);

    let followupId: string | undefined;
    if (followup && followup.consentToContact) {
      followupId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newFollowup: FollowupRequest = {
        requestId: followupId,
        relatedFeedbackId: feedbackId,
        fullName: (followup.fullName || followup.contactName || "नागरिक").trim(),
        contactName: (followup.fullName || followup.contactName || "नागरिक").trim(),
        fatherName: (followup.fatherName || "").trim(),
        mobileNumber: (followup.mobileNumber || followup.contactPhone || "").trim(),
        contactPhone: (followup.mobileNumber || followup.contactPhone || "").trim(),
        locality: (followup.locality || followup.ward || ward || "").trim(),
        ward: (followup.ward || ward || "").trim(),
        preferredContactMethod: followup.preferredContactMethod || "phone",
        subjectOrProblem: description.trim(),
        consentToContact: true,
        status: "new",
        createdAt: timestamp,
        isDemo: false,
      };
      await mongoInsertContactRequest(newFollowup);
    }

    return NextResponse.json({
      success: true,
      message:
        "आपकी समस्या और सुझाव साझा करने के लिए धन्यवाद। आपके सुझाव गाँव की विकास संबंधी प्राथमिकताओं को समझने में मदद करेंगे।",
      feedbackId,
      followupId,
    });
  } catch (err: unknown) {
    console.error("API error in feedback:", err);
    return NextResponse.json(
      { error: "समस्या दर्ज करने में सर्वर त्रुटि हुई।" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const body = await req.json();
    const { feedbackId, updates } = body;
    if (typeof feedbackId !== "string" || !feedbackId || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Invalid feedback update" }, { status: 400 });
    }

    const allowedFields = ["status", "moderationStatus", "internalNotes", "priority", "category"];
    const entries = Object.entries(updates);
    if (!entries.length || entries.some(([key]) => !allowedFields.includes(key))) {
      return NextResponse.json({ error: "No supported feedback fields to update" }, { status: 400 });
    }
    const validValues: Record<string, string[]> = {
      status: ["pending", "under_review", "addressed", "resolved"],
      moderationStatus: ["pending", "approved", "hidden"],
      priority: ["low", "medium", "high"],
      category: [
        "water",
        "roads",
        "drainage",
        "streetlights",
        "education",
        "health",
        "employment",
        "govSchemes",
        "cleanliness",
        "other",
      ],
    };
    if (
      entries.some(([key, value]) => {
        if (key === "internalNotes") return typeof value !== "string" || value.length > 2000;
        return !validValues[key]?.includes(value as string);
      })
    ) {
      return NextResponse.json({ error: "Invalid feedback field value" }, { status: 400 });
    }

    const { mongoUpdateFeedbackStatus } = await import("@/lib/mongoService");
    const updated = await mongoUpdateFeedbackStatus(feedbackId, updates);
    if (!updated) return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    return NextResponse.json({ success: true, adminEmail: admin.email });
  } catch (err) {
    console.error("API error updating feedback:", err);
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 });
  }
}
