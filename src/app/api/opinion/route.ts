import { NextRequest, NextResponse } from "next/server";
import {
  mongoGetAnonymousOpinions,
  mongoInsertOpinion,
  mongoGetAggregateStats,
  mongoGetActivePoll,
  mongoVoteOnPoll,
} from "@/lib/mongoService";
import { VoteChoice, AnonymousOpinion } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      voteChoice,
      selectedOption,
      expectations,
      biggestExpectation,
      noReasonPredefined,
      noReasonCustom,
    } = body;

    // Strict PII rejection: No personal identifiers permitted in anonymous survey
    const forbiddenKeys = [
      "name",
      "phone",
      "email",
      "address",
      "deviceId",
      "contactName",
      "contactPhone",
      "fullName",
      "fatherName",
      "mobileNumber",
      "ip",
      "fingerprint",
    ];
    for (const key of forbiddenKeys) {
      if (body[key] !== undefined) {
        return NextResponse.json(
          { error: "गोपनीय सर्वे में व्यक्तिगत जानकारी दर्ज करना वर्जित है।" },
          { status: 400 }
        );
      }
    }

    // Resolve vote choice
    let resolvedChoice: VoteChoice;
    if (voteChoice === "yes" || voteChoice === "no") {
      resolvedChoice = voteChoice;
    } else if (selectedOption === "support") {
      resolvedChoice = "yes";
    } else if (selectedOption === "undecided" || selectedOption === "other") {
      resolvedChoice = "no";
    } else {
      return NextResponse.json(
        { error: "कृपया हाँ (YES) अथवा नहीं (NO) में से एक विकल्प चुनें।" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const responseId = `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newOpinion: AnonymousOpinion = {
      responseId,
      voteChoice: resolvedChoice,
      selectedOption: resolvedChoice === "yes" ? "support" : "undecided",
      expectations: resolvedChoice === "yes" && Array.isArray(expectations) ? expectations.slice(0, 15) : [],
      biggestExpectation: resolvedChoice === "yes" && typeof biggestExpectation === "string" ? biggestExpectation.trim().slice(0, 1000) : "",
      noReasonPredefined: resolvedChoice === "no" && typeof noReasonPredefined === "string" ? noReasonPredefined.trim().slice(0, 300) : "",
      noReasonCustom: resolvedChoice === "no" && typeof noReasonCustom === "string" ? noReasonCustom.trim().slice(0, 1000) : "",
      createdAt: timestamp,
      isDemo: false,
    };

    // Store anonymous opinion in MongoDB
    await mongoInsertOpinion(newOpinion);

    // Increment the poll's totalVotes and the chosen option's votesCount in MongoDB
    // Determine which poll and option to increment
    const activePoll = await mongoGetActivePoll();
    const yesOption = activePoll.options.find(
      (option) =>
        option.id === "opt-yes" ||
        option.textHi.includes("हाँ") ||
        option.textEn.toLowerCase().includes("yes")
    );
    const noOption = activePoll.options.find(
      (option) =>
        option.id === "opt-no" ||
        option.textHi.includes("नहीं") ||
        option.textEn.toLowerCase().includes("no")
    );
    const targetPollId = activePoll.id;
    const targetOptionId =
      resolvedChoice === "yes"
        ? yesOption?.id || activePoll.options[0]?.id
        : noOption?.id || activePoll.options[1]?.id;

    if (targetOptionId) {
      await mongoVoteOnPoll(targetPollId, targetOptionId);
    }

    return NextResponse.json({
      success: true,
      message: "आपकी राय सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!",
      responseId,
      pollId: targetPollId,
      optionId: targetOptionId,
    });
  } catch (err: unknown) {
    console.error("API error in opinion/survey:", err);
    return NextResponse.json(
      { error: "सर्वे सबमिट करने में त्रुटि आई।" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const opinions = await mongoGetAnonymousOpinions();
    const stats = await mongoGetAggregateStats();
    return NextResponse.json({
      success: true,
      publicSurveyCount: opinions.length,
      surveyStats: stats.surveyStats,
    });
  } catch (err: unknown) {
    console.error("Error fetching survey count:", err);
    return NextResponse.json({ error: "Failed to fetch survey count" }, { status: 500 });
  }
}
