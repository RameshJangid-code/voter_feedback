import { NextRequest, NextResponse } from "next/server";
import { mongoGetContactRequests, mongoInsertContactRequest } from "@/lib/mongoService";
import { FollowupRequest, PreferredContactMethod } from "@/types";

export async function GET() {
  try {
    const list = await mongoGetContactRequests();
    return NextResponse.json({ success: true, count: list.length, contacts: list });
  } catch (err: any) {
    console.error("Error in GET /api/contact:", err);
    return NextResponse.json({ error: "Failed to fetch contact requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      fatherName,
      mobileNumber,
      locality,
      ward,
      preferredContactMethod,
      subjectOrProblem,
      consentToContact,
    } = body;

    // Strict validation
    if (!consentToContact) {
      return NextResponse.json(
        { error: "संपर्क अनुरोध दर्ज करने के लिए सहमति चेकबॉक्स पर टिक करना अनिवार्य है।" },
        { status: 400 }
      );
    }

    if (!mobileNumber || typeof mobileNumber !== "string" || mobileNumber.trim().length < 8) {
      return NextResponse.json(
        { error: "कृपया एक वैध मोबाइल नंबर अवश्य दर्ज करें।" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newRequest: FollowupRequest = {
      requestId,
      fullName: (fullName || "").trim() || "नागरिक",
      contactName: (fullName || "").trim() || "नागरिक",
      fatherName: (fatherName || "").trim(),
      mobileNumber: mobileNumber.trim(),
      contactPhone: mobileNumber.trim(),
      locality: (locality || ward || "").trim(),
      ward: (ward || locality || "").trim(),
      preferredContactMethod: (preferredContactMethod as PreferredContactMethod) || "phone",
      subjectOrProblem: (subjectOrProblem || "").trim(),
      consentToContact: true,
      status: "new",
      createdAt: timestamp,
      isDemo: false,
    };

    // Store in MongoDB
    await mongoInsertContactRequest(newRequest);

    return NextResponse.json({
      success: true,
      message:
        "आपका संपर्क अनुरोध सफलतापूर्वक दर्ज कर लिया गया है। श्री मोहन सिंह जी की टीम शीघ्र आपसे संपर्क करेगी।",
      requestId,
    });
  } catch (err: unknown) {
    console.error("API error in contact submission:", err);
    return NextResponse.json(
      { error: "संपर्क अनुरोध सबमिट करने में तकनीकी त्रुटि आई।" },
      { status: 500 }
    );
  }
}
