import { getMongoDb, MONGODB_COLLECTIONS } from "./mongodb";
import {
  realPublicFeedback,
  realFollowups,
  realAnonymousOpinions,
  realPostVoteDetails,
  realPolls,
  EXPECTATION_OPTIONS,
} from "./seedData";
import { defaultSiteContent } from "./initialContent";
import {
  PublicFeedback,
  FollowupRequest,
  AnonymousOpinion,
  PostVoteDetail,
  PollItem,
  SiteContent,
  AggregateStats,
  ProblemCategory,
} from "@/types";


let isSeeded = false;
let voterDetailsPrivacyMigrated = false;
let memoryContent: SiteContent = { ...defaultSiteContent };

export function isBinaryOpinionPoll(poll: PollItem): boolean {
  if (poll.options.length !== 2) return false;
  const isAffirmative = (label: string) => /हाँ|हां|समर्थन|सहमत|yes|support|agree/i.test(label);
  const isNegative = (label: string) => /नहीं|असहमत|no|oppose|disagree/i.test(label);
  return isAffirmative(poll.options[0].textHi) && isNegative(poll.options[1].textHi);
}

// In-memory active stores for seamless fallback
const memoryFeedback: PublicFeedback[] = [...realPublicFeedback];
const memoryFollowups: FollowupRequest[] = [...realFollowups];
const memoryOpinions: AnonymousOpinion[] = []; // starts empty - real votes only
const memoryPostVoteDetails: PostVoteDetail[] = []; // starts empty - real voters only
let memoryPolls: PollItem[] = [...realPolls];


// Remove MongoDB internal _id before returning to Next.js components/APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripId<T>(doc: Record<string, unknown> | any): T {
  if (!doc) return doc as unknown as T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = doc;
  return rest as unknown as T;
}

/**
 * Ensures MongoDB is seeded with real Budivada village data on first access
 */
export async function ensureMongoSeeded(): Promise<void> {
  if (isSeeded) return;
  const db = await getMongoDb();
  if (!db) return;

  try {
    // 1. Seed Site Content if missing
    const contentCount = await db.collection(MONGODB_COLLECTIONS.CONTENT).countDocuments();
    if (contentCount === 0) {
      await db.collection(MONGODB_COLLECTIONS.CONTENT).insertOne({
        contentId: "default",
        ...defaultSiteContent,
      });
      console.log("[MongoDB] Seeded real site content for Budivada");
    }

    // 2. Seed Public Feedback if missing
    const feedbackCount = await db.collection(MONGODB_COLLECTIONS.FEEDBACK).countDocuments();
    if (feedbackCount === 0) {
      await db.collection(MONGODB_COLLECTIONS.FEEDBACK).insertMany(realPublicFeedback);
      console.log(`[MongoDB] Seeded ${realPublicFeedback.length} real village grievances for Budivada`);
    }

    // 3. Seed Followups (Contact Requests) if missing
    const followupCount = await db.collection(MONGODB_COLLECTIONS.FOLLOWUPS).countDocuments();
    if (followupCount === 0) {
      await db.collection(MONGODB_COLLECTIONS.FOLLOWUPS).insertMany(realFollowups);
      console.log(`[MongoDB] Seeded ${realFollowups.length} real contact requests`);
    }

    // 4. Seed Anonymous Opinions if missing
    const opinionsCount = await db.collection(MONGODB_COLLECTIONS.OPINIONS).countDocuments();
    if (opinionsCount === 0 && realAnonymousOpinions.length > 0) {
      await db.collection(MONGODB_COLLECTIONS.OPINIONS).insertMany(realAnonymousOpinions);
      console.log(`[MongoDB] Seeded ${realAnonymousOpinions.length} real anonymous community votes`);
    }

    // 5. Seed Post-Vote Voter Details if missing
    const pvdCount = await db.collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS).countDocuments();
    if (pvdCount === 0 && realPostVoteDetails.length > 0) {
      await db.collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS).insertMany(realPostVoteDetails);
      console.log(`[MongoDB] Seeded ${realPostVoteDetails.length} real voluntary voter registrations`);
    }

    if (!voterDetailsPrivacyMigrated) {
      await db.collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS).updateMany(
        {},
        {
          $unset: {
            relatedSurveyId: "",
            pollId: "",
            pollOptionId: "",
            voteChoiceLabel: "",
          },
        }
      );
      voterDetailsPrivacyMigrated = true;
    }

    // 6. Seed Polls if missing
    const pollsCount = await db.collection(MONGODB_COLLECTIONS.POLLS).countDocuments();
    if (pollsCount === 0) {
      await db.collection(MONGODB_COLLECTIONS.POLLS).insertMany(realPolls);
      console.log(`[MongoDB] Seeded ${realPolls.length} real polls for Budivada`);
    }

    isSeeded = true;
  } catch (err) {
    console.error("[MongoDB] Error ensuring collections seeded:", err);
  }
}

// -------------------------------------------------------------
// MongoDB Public Feedback
// -------------------------------------------------------------
export async function mongoGetAllFeedback(includePrivate = false): Promise<PublicFeedback[]> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    return includePrivate
      ? memoryFeedback
      : memoryFeedback.filter((item) => item.moderationStatus === "approved");
  }

  const query = includePrivate ? {} : { moderationStatus: "approved" };

  const docs = await db
    .collection(MONGODB_COLLECTIONS.FEEDBACK)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => stripId<PublicFeedback>(d));
}

export async function mongoInsertFeedback(feedback: PublicFeedback): Promise<void> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    memoryFeedback.unshift(feedback);
    return;
  }

  await db.collection(MONGODB_COLLECTIONS.FEEDBACK).insertOne(feedback);
}


export async function mongoUpdateFeedbackStatus(
  feedbackId: string,
  updates: Partial<PublicFeedback>
): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) {
    const item = memoryFeedback.find((feedback) => feedback.feedbackId === feedbackId);
    if (!item) return false;
    Object.assign(item, updates);
    return true;
  }

  const result = await db.collection(MONGODB_COLLECTIONS.FEEDBACK).updateOne(
    { feedbackId },
    { $set: updates }
  );
  return result.matchedCount > 0;
}

// -------------------------------------------------------------
// MongoDB Contact Requests (Followups)
// -------------------------------------------------------------
export async function mongoGetContactRequests(): Promise<FollowupRequest[]> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) return memoryFollowups;

  const docs = await db
    .collection(MONGODB_COLLECTIONS.FOLLOWUPS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => stripId<FollowupRequest>(d));
}

export async function mongoInsertContactRequest(req: FollowupRequest): Promise<void> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    memoryFollowups.unshift(req);
    return;
  }

  await db.collection(MONGODB_COLLECTIONS.FOLLOWUPS).insertOne(req);
}

export async function mongoUpdateContactRequestStatus(
  requestId: string,
  updates: Partial<FollowupRequest>
): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) {
    const item = memoryFollowups.find((r) => r.requestId === requestId);
    if (!item) return false;
    Object.assign(item, updates);
    return true;
  }

  const result = await db.collection(MONGODB_COLLECTIONS.FOLLOWUPS).updateOne(
    { requestId },
    { $set: updates }
  );
  return result.matchedCount > 0;
}

// -------------------------------------------------------------
// MongoDB Anonymous Opinions (Votes)
// -------------------------------------------------------------
export async function mongoGetAnonymousOpinions(): Promise<AnonymousOpinion[]> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) return memoryOpinions;

  const docs = await db
    .collection(MONGODB_COLLECTIONS.OPINIONS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => stripId<AnonymousOpinion>(d));
}

export async function mongoInsertOpinion(opinion: AnonymousOpinion): Promise<void> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    memoryOpinions.unshift(opinion);
    return;
  }

  await db.collection(MONGODB_COLLECTIONS.OPINIONS).insertOne(opinion);
}

// -------------------------------------------------------------
// MongoDB Post-Vote Registered Voter Details
// -------------------------------------------------------------
export async function mongoGetPostVoteDetails(): Promise<PostVoteDetail[]> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) return memoryPostVoteDetails;

  const docs = await db
    .collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => stripId<PostVoteDetail>(d));
}

export async function mongoInsertPostVoteDetail(detail: PostVoteDetail): Promise<void> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    // In-memory fallback
    memoryPostVoteDetails.unshift(detail);
    return;
  }
  await db.collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS).insertOne({
    ...detail,
  });
}

// -------------------------------------------------------------
// MongoDB Polls Management
// -------------------------------------------------------------
export async function mongoGetAllPolls(): Promise<PollItem[]> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) return memoryPolls;

  const docs = await db
    .collection(MONGODB_COLLECTIONS.POLLS)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((d) => stripId<PollItem>(d));
}

export async function mongoGetActivePoll(): Promise<PollItem> {
  const polls = await mongoGetAllPolls();
  const active = polls.find((poll) => poll.isActive && isBinaryOpinionPoll(poll));
  if (active) return active;
  return polls.find(isBinaryOpinionPoll) || realPolls.find(isBinaryOpinionPoll) || realPolls[0];
}

export async function mongoInsertPoll(poll: PollItem): Promise<void> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) {
    if (poll.isActive) {
      memoryPolls.forEach((p) => {
        p.isActive = false;
      });
    }
    memoryPolls.unshift(poll);
    return;
  }

  if (poll.isActive) {
    await db.collection(MONGODB_COLLECTIONS.POLLS).updateMany({}, { $set: { isActive: false } });
  }

  await db.collection(MONGODB_COLLECTIONS.POLLS).insertOne(poll);
}

export async function mongoSetActivePoll(pollId: string): Promise<void> {
  const db = await getMongoDb();
  if (!db) {
    memoryPolls.forEach((p) => {
      p.isActive = p.id === pollId;
    });
    return;
  }

  await db.collection(MONGODB_COLLECTIONS.POLLS).updateMany({}, { $set: { isActive: false } });
  await db.collection(MONGODB_COLLECTIONS.POLLS).updateOne({ id: pollId }, { $set: { isActive: true } });
}

export async function mongoTogglePollStatus(pollId: string): Promise<void> {
  const db = await getMongoDb();
  if (!db) {
    const current = memoryPolls.find((p) => p.id === pollId);
    if (current) current.isActive = !current.isActive;
    return;
  }

  const current = await db.collection(MONGODB_COLLECTIONS.POLLS).findOne({ id: pollId });
  if (current) {
    await db.collection(MONGODB_COLLECTIONS.POLLS).updateOne(
      { id: pollId },
      { $set: { isActive: !current.isActive } }
    );
  }
}

export async function mongoDeletePoll(pollId: string): Promise<boolean> {
  const db = await getMongoDb();
  if (!db) {
    const target = memoryPolls.find((p) => p.id === pollId);
    if (!target || target.isDefault) return false;
    memoryPolls = memoryPolls.filter((p) => p.id !== pollId);
    if (target.isActive && memoryPolls.length > 0) {
      memoryPolls[0].isActive = true;
    }
    return true;
  }

  const current = await db.collection(MONGODB_COLLECTIONS.POLLS).findOne({ id: pollId });
  if (!current || current.isDefault) return false;

  await db.collection(MONGODB_COLLECTIONS.POLLS).deleteOne({ id: pollId });
  return true;
}

/**
 * Atomically increment totalVotes on the poll and votesCount on the specific option.
 * This is called EVERY time a user casts a vote so the count is always live.
 */
export async function mongoVoteOnPoll(pollId: string, optionId: string): Promise<void> {
  const db = await getMongoDb();
  if (!db) {
    // Fallback: update in-memory poll counters
    const poll = memoryPolls.find((p) => p.id === pollId);
    if (poll) {
      poll.totalVotes = (poll.totalVotes || 0) + 1;
      const option = poll.options.find((o) => o.id === optionId);
      if (option) {
        option.votesCount = (option.votesCount || 0) + 1;
      }
    }
    return;
  }

  // Atomically increment the poll's total vote count
  await db.collection(MONGODB_COLLECTIONS.POLLS).updateOne(
    { id: pollId },
    { $inc: { totalVotes: 1 } }
  );

  // Atomically increment the specific option's vote count
  await db.collection(MONGODB_COLLECTIONS.POLLS).updateOne(
    { id: pollId, "options.id": optionId },
    { $inc: { "options.$.votesCount": 1 } }
  );
}

// -------------------------------------------------------------
// MongoDB Aggregate Statistics Computation
// -------------------------------------------------------------
export async function mongoGetAggregateStats(): Promise<AggregateStats> {
  await ensureMongoSeeded();
  const allFeedback = await mongoGetAllFeedback(true);
  const opinions = await mongoGetAnonymousOpinions();

  const categoryCounts: Record<ProblemCategory, number> = {
    water: 0,
    roads: 0,
    drainage: 0,
    streetlights: 0,
    education: 0,
    health: 0,
    employment: 0,
    govSchemes: 0,
    cleanliness: 0,
    other: 0,
  };

  let pendingCount = 0;
  let underReviewCount = 0;
  let addressedCount = 0;
  let resolvedCount = 0;
  let highPriorityCount = 0;
  let mediumPriorityCount = 0;
  let lowPriorityCount = 0;

  for (const item of allFeedback) {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category]++;
    }
    if (item.status === "pending") pendingCount++;
    else if (item.status === "under_review") underReviewCount++;
    else if (item.status === "addressed") addressedCount++;
    else if (item.status === "resolved") resolvedCount++;

    if (item.priority === "high") highPriorityCount++;
    else if (item.priority === "medium") mediumPriorityCount++;
    else if (item.priority === "low") lowPriorityCount++;
  }

  // Survey Stats
  let yesCount = 0;
  let noCount = 0;
  let realSurveysCount = 0;
  let demoSurveysCount = 0;

  const expectationCountMap: Record<string, number> = {};
  const noReasonCountMap: Record<string, number> = {};
  const dateWiseMap: Record<string, { yes: number; no: number; total: number }> = {};

  for (const op of opinions) {
    if (op.isDemo === true) demoSurveysCount++;
    else realSurveysCount++;

    const isYes = op.voteChoice === "yes" || op.selectedOption === "support";
    if (isYes) yesCount++;
    else noCount++;

    if (op.expectations && Array.isArray(op.expectations)) {
      for (const exp of op.expectations) {
        expectationCountMap[exp] = (expectationCountMap[exp] || 0) + 1;
      }
    }

    if (!isYes) {
      const reasonKey = op.noReasonPredefined || (op.noReasonCustom ? "व्यक्तिगत कारण दिया" : "कारण नहीं बताया (छोड़ा गया)");
      noReasonCountMap[reasonKey] = (noReasonCountMap[reasonKey] || 0) + 1;
    }

    const dateStr = op.createdAt ? op.createdAt.split("T")[0] : "पूर्व";
    if (!dateWiseMap[dateStr]) {
      dateWiseMap[dateStr] = { yes: 0, no: 0, total: 0 };
    }
    dateWiseMap[dateStr].total++;
    if (isYes) dateWiseMap[dateStr].yes++;
    else dateWiseMap[dateStr].no++;
  }

  const totalSurveys = opinions.length;
  const yesPercent = totalSurveys > 0 ? Math.round((yesCount / totalSurveys) * 100) : 0;
  const noPercent = totalSurveys > 0 ? Math.round((noCount / totalSurveys) * 100) : 0;

  const topExpectations = EXPECTATION_OPTIONS.map((opt) => {
    const count = expectationCountMap[opt.key] || 0;
    const percent = yesCount > 0 ? Math.round((count / yesCount) * 100) : 0;
    return {
      key: opt.key,
      labelHi: opt.labelHi,
      labelEn: opt.labelEn,
      count,
      percent,
    };
  }).sort((a, b) => b.count - a.count);

  const commonNoReasons = Object.entries(noReasonCountMap)
    .map(([reason, count]) => ({
      reason,
      count,
      percent: noCount > 0 ? Math.round((count / noCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const dateWiseTrend = Object.entries(dateWiseMap)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-7)
    .map(([date, data]) => ({
      date,
      yes: data.yes,
      no: data.no,
      total: data.total,
    }));

  return {
    totalFeedback: allFeedback.length,
    uniqueRecords: allFeedback.length,
    pendingCount,
    underReviewCount,
    addressedCount,
    resolvedCount,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    categoryCounts,
    opinionStats: {
      total: totalSurveys,
      support: yesCount,
      undecided: noCount,
      other: 0,
      supportPercent: yesPercent,
      undecidedPercent: noPercent,
      otherPercent: 0,
    },
    surveyStats: {
      totalSurveys,
      realSurveysCount: realSurveysCount || totalSurveys,
      demoSurveysCount,
      yesCount,
      noCount,
      yesPercent,
      noPercent,
      topExpectations,
      commonNoReasons,
      dateWiseTrend,
    },
  };
}

// -------------------------------------------------------------
// MongoDB Site Content
// -------------------------------------------------------------
export async function mongoGetSiteContent(): Promise<SiteContent> {
  await ensureMongoSeeded();
  const db = await getMongoDb();
  if (!db) return memoryContent;

  const doc = await db.collection(MONGODB_COLLECTIONS.CONTENT).findOne({ contentId: "default" });
  if (doc) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, contentId, ...rest } = doc as Record<string, unknown>;
    return rest as unknown as SiteContent;
  }

  return defaultSiteContent;
}

export async function mongoUpdateSiteContent(content: Partial<SiteContent>): Promise<SiteContent> {
  const db = await getMongoDb();
  const updated: SiteContent = {
    ...(db ? await mongoGetSiteContent() : memoryContent),
    ...content,
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    memoryContent = updated;
    return updated;
  }

  await db.collection(MONGODB_COLLECTIONS.CONTENT).updateOne(
    { contentId: "default" },
    { $set: { ...updated, contentId: "default" } },
    { upsert: true }
  );

  return updated;
}
