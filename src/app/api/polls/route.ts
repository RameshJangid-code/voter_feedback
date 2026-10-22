import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import {
  mongoGetAllPolls,
  mongoGetActivePoll,
  mongoInsertPoll,
  mongoSetActivePoll,
  mongoTogglePollStatus,
  mongoDeletePoll,
  isBinaryOpinionPoll,
} from "@/lib/mongoService";
import { PollItem } from "@/types";
import { isAdminIdentity, requireAdmin } from "@/lib/adminAuth";

function isSupportedChoice(label: string, affirmative: boolean): boolean {
  const normalized = label.trim().toLowerCase();
  return affirmative
    ? /हाँ|हां|समर्थन|सहमत|yes|support|agree/.test(normalized)
    : /नहीं|असहमत|no|oppose|disagree/.test(normalized);
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const [polls, activePoll] = await Promise.all([
      mongoGetAllPolls(),
      mongoGetActivePoll(),
    ]);
    return NextResponse.json({ success: true, polls, activePoll });
  } catch (err: unknown) {
    console.error("Error in GET /api/polls:", err);
    return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const body = await req.json();
    const { titleHi, titleEn, descriptionHi, descriptionEn, options, setActive } = body;

    if (!titleHi || typeof titleHi !== "string" || !titleHi.trim()) {
      return NextResponse.json({ error: "पोल का शीर्षक अनिवार्य है।" }, { status: 400 });
    }

    if (
      !Array.isArray(options) ||
      options.length !== 2 ||
      options.some((opt) => !opt || typeof opt.textHi !== "string" || !opt.textHi.trim()) ||
      !isSupportedChoice(options[0].textHi, true) ||
      !isSupportedChoice(options[1].textHi, false)
    ) {
      return NextResponse.json(
        { error: "इस सर्वे में पहला विकल्प समर्थन/हाँ और दूसरा असहमति/नहीं होना चाहिए।" },
        { status: 400 }
      );
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
      options: options.map((opt: { textHi?: string; textEn?: string }, idx: number) => ({
        id: `opt-${pollId}-${idx + 1}`,
        textHi: (opt.textHi || `विकल्प ${idx + 1}`).trim(),
        textEn: (opt.textEn || opt.textHi || `Option ${idx + 1}`).trim(),
        votesCount: 0,
      })),
    };

    await mongoInsertPoll(newPoll);

    return NextResponse.json({ success: true, poll: newPoll });
  } catch (err: unknown) {
    console.error("Error in POST /api/polls:", err);
    return NextResponse.json({ error: "Failed to create poll" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

  try {
    const body = await req.json();
    const { pollId, action } = body;

    if (!pollId || !["setActive", "toggle"].includes(action)) {
      return NextResponse.json({ error: "pollId is required" }, { status: 400 });
    }

    const poll = (await mongoGetAllPolls()).find((candidate) => candidate.id === pollId);
    if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    if ((action === "setActive" || !poll.isActive) && !isBinaryOpinionPoll(poll)) {
      return NextResponse.json(
        { error: "Only binary yes/no opinion polls can be activated on the public opinion form." },
        { status: 400 }
      );
    }

    if (action === "setActive") {
      await mongoSetActivePoll(pollId);
    } else {
      await mongoTogglePollStatus(pollId);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error in PUT /api/polls:", err);
    return NextResponse.json({ error: "Failed to update poll" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!isAdminIdentity(admin)) return admin;

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
  } catch (err: unknown) {
    console.error("Error in DELETE /api/polls:", err);
    return NextResponse.json({ error: "Failed to delete poll" }, { status: 500 });
  }
}
