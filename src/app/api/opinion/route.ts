import { NextRequest, NextResponse } from "next/server";
import { submitAnonymousOpinion } from "@/lib/dataService";
import { OpinionOption } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedOption } = body;

    const validOptions: OpinionOption[] = ["support", "undecided", "other"];
    if (!validOptions.includes(selectedOption)) {
      return NextResponse.json({ error: "अमान्य विकल्प।" }, { status: 400 });
    }

    const result = await submitAnonymousOpinion(selectedOption);

    return NextResponse.json({
      success: true,
      message: "आपकी राय सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!",
      ...result,
    });
  } catch (err: unknown) {
    console.error("API error in opinion:", err);
    return NextResponse.json(
      { error: "राय दर्ज करने में त्रुटि आई।" },
      { status: 500 }
    );
  }
}
