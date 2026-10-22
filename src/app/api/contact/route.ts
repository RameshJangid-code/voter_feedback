export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

import {
  mongoGetContactRequests,
  mongoInsertContactRequest,
  mongoUpdateContactRequestStatus,
} from "@/lib/mongoService";
import { FollowupRequest, PreferredContactMethod } from "@/types";
import { isAdminIdentity, requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const list = await mongoGetContactRequests();
    return NextResponse.json({ success: true, count: list.length, contacts: list });
  } catch (err: unknown) {
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

    if (typeof fullName !== "string" || fullName.trim().length > 100) {
      return NextResponse.json({ error: "कृपया मान्य नाम दर्ज करें।" }, { status: 400 });
    }

    if (!mobileNumber || typeof mobileNumber !== "string" || mobileNumber.trim().length < 8) {
      return NextResponse.json(
        { error: "कृपया एक वैध मोबाइल नंबर अवश्य दर्ज करें।" },
        { status: 400 }
      );
    }
    if (
      [fatherName, locality, ward, subjectOrProblem].some(
        (value) => value !== undefined && (typeof value !== "string" || value.length > 1500)
      )
    ) {
      return NextResponse.json({ error: "संपर्क विवरण बहुत लंबा या अमान्य है।" }, { status: 400 });
    }
    if (
      preferredContactMethod !== undefined &&
      !["phone", "whatsapp", "in_person"].includes(preferredContactMethod)
    ) {
      return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
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

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const body = await req.json();
    const { requestId, status, adminNotes } = body;
    const validStatuses = ["new", "contacted", "in_progress", "resolved"];
    if (typeof requestId !== "string" || !requestId || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid contact request update" }, { status: 400 });
    }
    if (adminNotes !== undefined && (typeof adminNotes !== "string" || adminNotes.length > 2000)) {
      return NextResponse.json({ error: "Invalid admin notes" }, { status: 400 });
    }

    const updated = await mongoUpdateContactRequestStatus(requestId, { status, adminNotes });
    if (!updated) return NextResponse.json({ error: "Contact request not found" }, { status: 404 });
    return NextResponse.json({ success: true, adminEmail: admin.email });
  } catch (err) {
    console.error("API error updating contact request:", err);
    return NextResponse.json({ error: "Failed to update contact request" }, { status: 500 });
  }
}
