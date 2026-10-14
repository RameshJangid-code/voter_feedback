import { NextRequest, NextResponse } from "next/server";
import { submitPublicFeedback } from "@/lib/dataService";
import { ProblemCategory, ProblemPriority } from "@/types";

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

    const validPriorities: ProblemPriority[] = ["low", "medium", "high"];
    const checkedPriority: ProblemPriority = validPriorities.includes(priority)
      ? priority
      : "medium";

    const result = await submitPublicFeedback({
      category,
      description: description.trim(),
      suggestedImprovement: (suggestedImprovement || "").trim(),
      priority: checkedPriority,
      ward: (ward || "").trim(),
      villageDevelopmentSuggestion: (villageDevelopmentSuggestion || "").trim(),
      followup:
        followup && followup.consentToContact
          ? {
              contactName: (followup.contactName || "").trim(),
              contactPhone: (followup.contactPhone || "").trim(),
              ward: (followup.ward || "").trim(),
              consentToContact: true,
            }
          : undefined,
    });

    return NextResponse.json({
      success: true,
      message:
        "आपकी समस्या और सुझाव साझा करने के लिए धन्यवाद। आपके सुझाव गाँव की विकास संबंधी प्राथमिकताओं को समझने में मदद करेंगे।",
      ...result,
    });
  } catch (err: unknown) {
    console.error("API error in feedback:", err);
    return NextResponse.json(
      { error: "समस्या दर्ज करने में सर्वर त्रुटि हुई।" },
      { status: 500 }
    );
  }
}
