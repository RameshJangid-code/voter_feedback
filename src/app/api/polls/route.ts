import { NextRequest, NextResponse } from "next/server";
import {
  mongoGetAllPolls,
  mongoGetActivePoll,
  mongoInsertPoll,
  mongoSetActivePoll,
  mongoTogglePollStatus,
  mongoDeletePoll,
} from "@/lib/mongoService";
import { PollItem } from "@/types";

export async function GET() {
  try {
    const [polls, activePoll] = await Promise.all([
      mongoGetAllPolls(),
      mongoGetActivePoll(),
    ]);
    return NextResponse.json({ success: true, polls, activePoll });
  } catch (err: any) {
    console.error("Error in GET /api/polls:", err);
    return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titleHi, titleEn, descriptionHi, descriptionEn, options, setActive } = body;

    if (!titleHi || typeof titleHi !== "string" || !titleHi.trim()) {
      return NextResponse.json({ error: "पोल का शीर्षक अनिवार्य है।" }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "कम से कम 2 विकल्प आवश्यक हैं।" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const pollId = `poll-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

    const newPoll: PollItem = {
      id: pollId,
      titleHi: titleHi.trim(),
      titleEn: (titleEn || titleHi).trim(),
      descriptionHi: (descriptionHi || "").trim(),
      descriptionEn: (descriptionEn || "").trim(),
      isActive: Boolean(setActive),
      isDefault: false,
      createdAt: timestamp,
      totalVotes: 0,
      options: options.map((opt: any, idx: number) => ({
        id: `opt-${pollId}-${idx + 1}`,
        textHi: (opt.textHi || `विकल्प ${idx + 1}`).trim(),
        textEn: (opt.textEn || opt.textHi || `Option ${idx + 1}`).trim(),
        votesCount: 0,
      })),
    };

    await mongoInsertPoll(newPoll);

    return NextResponse.json({ success: true, poll: newPoll });
  } catch (err: any) {
    console.error("Error in POST /api/polls:", err);
    return NextResponse.json({ error: "Failed to create poll" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { pollId, action } = body;

    if (!pollId) {
      return NextResponse.json({ error: "pollId is required" }, { status: 400 });
    }

    if (action === "setActive") {
      await mongoSetActivePoll(pollId);
    } else {
      await mongoTogglePollStatus(pollId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in PUT /api/polls:", err);
    return NextResponse.json({ error: "Failed to update poll" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pollId = searchParams.get("pollId");

    if (!pollId) {
      return NextResponse.json({ error: "pollId is required" }, { status: 400 });
    }

    const deleted = await mongoDeletePoll(pollId);
    if (!deleted) {
      return NextResponse.json({ error: "Cannot delete default poll" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in DELETE /api/polls:", err);
    return NextResponse.json({ error: "Failed to delete poll" }, { status: 500 });
  }
}
