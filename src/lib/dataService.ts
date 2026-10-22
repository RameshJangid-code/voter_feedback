import {
  PublicFeedback,
  FollowupRequest,
  AnonymousOpinion,
  SiteContent,
  AuditLog,
  AggregateStats,
  ProblemCategory,
  FeedbackStatus,
  ModerationStatus,
  VoteChoice,
  ExpectationItem,
  NoReasonItem,
  PreferredContactMethod,
  PostVoteDetail,
  PollItem,
} from "@/types";
import { defaultSiteContent } from "./initialContent";
import {
  demoPublicFeedback,
  demoFollowups,
  demoPolls,
  EXPECTATION_OPTIONS,
} from "./seedData";

import { isFirebaseConfigured, db } from "./firebase";
import { adminApiFetch, throwForApiError } from "./adminApi";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Local Storage keys for fallback/demo storage
const STORAGE_KEYS = {
  FEEDBACK: "budivada_public_feedback_v1",
  FOLLOWUPS: "budivada_followup_requests_v1",
  OPINIONS: "budivada_anonymous_opinions_v1",
  CONTENT: "budivada_site_content_v1",
  LOGS: "budivada_audit_logs_v1",
  POLLS: "budivada_admin_polls_v1",
  POST_VOTE_DETAILS: "janawaaz_post_vote_details_v1",
};

// In-memory fallback if server-side rendering or localStorage not available
let memFeedback: PublicFeedback[] = [...demoPublicFeedback];
let memFollowups: FollowupRequest[] = [...demoFollowups];
let memOpinions: AnonymousOpinion[] = []; // starts empty — only real user votes
let memContent: SiteContent = { ...defaultSiteContent };
let memPostVoteDetails: PostVoteDetail[] = []; // starts empty — only real voter details
let memPolls: PollItem[] = [...demoPolls];
let memLogs: AuditLog[] = [

  {
    logId: "log-init-1",
    adminEmail: "admin@budivada.in",
    action: "SYSTEM_INITIALIZED",
    targetId: "system",
    details: "Portal initialized with default village priorities and demo data.",
    timestamp: "2026-10-10T08:00:00Z",
  },
];

// Helper to get local data safely
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setLocalItem<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// -------------------------------------------------------------
// Public Feedback Service
// -------------------------------------------------------------
export async function getAllFeedback(includePrivate = false): Promise<PublicFeedback[]> {
  if (typeof window !== "undefined") {
    try {
      const res = includePrivate
        ? await adminApiFetch(`/api/feedback?all=true`)
        : await fetch("/api/feedback");
      if (includePrivate) await throwForApiError(res);
      if (res.ok) {
        const data = await res.json();
        if (data.feedback && Array.isArray(data.feedback)) {
          setLocalItem(STORAGE_KEYS.FEEDBACK, data.feedback);
          return data.feedback;
        }
      }
    } catch (error) {
      if (includePrivate) throw error;
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "public_feedback");
      const q = includePrivate
        ? query(colRef, orderBy("createdAt", "desc"))
        : query(colRef, where("moderationStatus", "==", "approved"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: PublicFeedback[] = [];
      snapshot.forEach((docSnap) => items.push(docSnap.data() as PublicFeedback));
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore read failed, falling back to local store:", err);
    }
  }

  const list = getLocalItem<PublicFeedback[]>(STORAGE_KEYS.FEEDBACK, memFeedback);
  if (includePrivate) {
    return list;
  }
  return list.filter((item) => item.moderationStatus === "approved");
}

export async function submitPublicFeedback(params: {
  category: ProblemCategory;
  description: string;
  suggestedImprovement: string;
  priority: "low" | "medium" | "high";
  ward?: string;
  villageDevelopmentSuggestion?: string;
  followup?: {
    fullName?: string;
    contactName?: string;
    fatherName?: string;
    mobileNumber?: string;
    contactPhone?: string;
    ward?: string;
    locality?: string;
    preferredContactMethod?: PreferredContactMethod;
    consentToContact: boolean;
  };
}): Promise<{ feedbackId: string; followupId?: string }> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  await throwForApiError(res);
  const data = await res.json();
  if (typeof data.feedbackId !== "string") {
    throw new Error("Feedback API returned an invalid response.");
  }
  const feedbackId = data.feedbackId as string;
  const followupId = data.followupId as string | undefined;

  const timestamp = new Date().toISOString();
  const newFeedback: PublicFeedback = {

    feedbackId,
    category: params.category,
    description: params.description.trim(),
    suggestedImprovement: params.suggestedImprovement.trim(),
    priority: params.priority,
    ward: params.ward?.trim() || "",
    villageDevelopmentSuggestion: params.villageDevelopmentSuggestion?.trim() || "",
    moderationStatus: "approved",
    status: "pending",
    internalNotes: "",
    createdAt: timestamp,
    isPublic: true,
    isDemo: false,
  };

  // Stored strictly in separate followup_requests collection if consented
  if (params.followup && params.followup.consentToContact) {
    if (!followupId) throw new Error("Contact follow-up was not saved by the server.");
    const newFollowup: FollowupRequest = {
      requestId: followupId,
      relatedFeedbackId: feedbackId,
      fullName: params.followup.fullName?.trim() || params.followup.contactName?.trim() || "नाम नहीं दिया",
      contactName: params.followup.fullName?.trim() || params.followup.contactName?.trim() || "नाम नहीं दिया",
      fatherName: params.followup.fatherName?.trim() || "",
      mobileNumber: params.followup.mobileNumber?.trim() || params.followup.contactPhone?.trim() || "",
      contactPhone: params.followup.mobileNumber?.trim() || params.followup.contactPhone?.trim() || "",
      locality: params.followup.locality?.trim() || params.followup.ward?.trim() || params.ward || "",
      ward: params.followup.ward?.trim() || params.ward || "",
      preferredContactMethod: params.followup.preferredContactMethod || "phone",
      subjectOrProblem: params.description.trim(),
      consentToContact: true,
      status: "new",
      createdAt: timestamp,
      isDemo: false,
    };

    const currentFollowups = getLocalItem<FollowupRequest[]>(STORAGE_KEYS.FOLLOWUPS, memFollowups);
    currentFollowups.unshift(newFollowup);
    setLocalItem(STORAGE_KEYS.FOLLOWUPS, currentFollowups);
    memFollowups = currentFollowups;
  }

  const currentFeedback = getLocalItem<PublicFeedback[]>(STORAGE_KEYS.FEEDBACK, memFeedback);
  currentFeedback.unshift(newFeedback);
  setLocalItem(STORAGE_KEYS.FEEDBACK, currentFeedback);
  memFeedback = currentFeedback;

  return { feedbackId, followupId };
}

// -------------------------------------------------------------
// Separate Voluntary Contact Form Service
// (For residents who want to be contacted about village problems/suggestions)
// Strict rule: NEVER linked to political opinions/surveys!
// -------------------------------------------------------------
export async function submitContactRequest(params: {
  fullName: string;
  fatherName?: string;
  mobileNumber: string;
  locality?: string;
  preferredContactMethod?: PreferredContactMethod;
  subjectOrProblem?: string;
  consentToContact: boolean;
}): Promise<{ requestId: string }> {
  if (!params.consentToContact) {
    throw new Error("सहमति चेकबॉक्स अनिवार्य है।");
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  await throwForApiError(response);
  return response.json();
}

export async function getContactRequests(): Promise<FollowupRequest[]> {
  if (typeof window !== "undefined") {
    const res = await adminApiFetch("/api/contact");
    await throwForApiError(res);
    const data = await res.json();
    if (data.contacts && Array.isArray(data.contacts)) {
      setLocalItem(STORAGE_KEYS.FOLLOWUPS, data.contacts);
      return data.contacts;
    }
  }

  return [];
}


// Backward compatibility alias
export const getFollowupRequests = getContactRequests;

export async function updateContactRequestStatus(
  requestId: string,
  updates: { status: "new" | "contacted" | "in_progress" | "resolved"; adminNotes?: string },
  adminEmail: string
): Promise<FollowupRequest | null> {
  const all = await getContactRequests();
  const index = all.findIndex((r) => r.requestId === requestId);
  if (index === -1) return null;

  const response = await adminApiFetch("/api/contact", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, ...updates }),
  });
  await throwForApiError(response);

  const updated: FollowupRequest = { ...all[index], ...updates };
  all[index] = updated;
  setLocalItem(STORAGE_KEYS.FOLLOWUPS, all);
  memFollowups = all;

  await recordAuditLog({
    adminEmail,
    action: "UPDATE_CONTACT_REQUEST",
    targetId: requestId,
    details: `Updated contact request status to ${updates.status}`,
  });

  return updated;
}

// -------------------------------------------------------------
// Anonymous Survey Service
// (Strict privacy: NO names, NO phone numbers, NO device IDs)
// -------------------------------------------------------------
export async function submitAnonymousSurvey(params: {
  voteChoice: VoteChoice;
  expectations?: string[];
  biggestExpectation?: string;
  noReasonPredefined?: string;
  noReasonCustom?: string;
}): Promise<{ responseId: string; pollId?: string; optionId?: string }> {
  const timestamp = new Date().toISOString();
  let responseId = `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let pollId: string | undefined;
  let optionId: string | undefined;

  if (typeof window !== "undefined") {
    const res = await fetch("/api/opinion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    await throwForApiError(res);
    const data = await res.json();
    if (data.responseId) responseId = data.responseId;
    if (data.pollId) pollId = data.pollId;
    if (data.optionId) optionId = data.optionId;
  }

  const newOpinion: AnonymousOpinion = {
    responseId,
    voteChoice: params.voteChoice,
    selectedOption: params.voteChoice === "yes" ? "support" : "undecided",
    expectations: params.voteChoice === "yes" ? params.expectations || [] : [],
    biggestExpectation: params.voteChoice === "yes" ? params.biggestExpectation?.trim() || "" : "",
    noReasonPredefined: params.voteChoice === "no" ? params.noReasonPredefined?.trim() || "" : "",
    noReasonCustom: params.voteChoice === "no" ? params.noReasonCustom?.trim() || "" : "",
    createdAt: timestamp,
    isDemo: false, // strictly marked as real submission
  };

  const currentOpinions = getLocalItem<AnonymousOpinion[]>(STORAGE_KEYS.OPINIONS, memOpinions);
  currentOpinions.unshift(newOpinion);
  setLocalItem(STORAGE_KEYS.OPINIONS, currentOpinions);
  memOpinions = currentOpinions;

  return { responseId, pollId, optionId };
}


// Backward compatibility alias
export async function submitAnonymousOpinion(selectedOption: "support" | "undecided" | "other"): Promise<{ responseId: string }> {
  return submitAnonymousSurvey({
    voteChoice: selectedOption === "support" ? "yes" : "no",
    noReasonPredefined: selectedOption !== "support" ? (selectedOption === "undecided" ? "अभी अनिर्णित" : "अन्य विकल्प") : undefined,
  });
}

export async function getAnonymousOpinions(): Promise<AnonymousOpinion[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "anonymous_opinions");
      const snapshot = await getDocs(colRef);
      const items: AnonymousOpinion[] = [];
      snapshot.forEach((d) => items.push(d.data() as AnonymousOpinion));
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore read opinions failed, using fallback:", err);
    }
  }
  return getLocalItem<AnonymousOpinion[]>(STORAGE_KEYS.OPINIONS, memOpinions);
}

/**
 * Public Survey Count:
 * Calculated from real submitted survey records in MongoDB / storage
 */
export async function getPublicSurveyCount(): Promise<number> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/opinion");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.publicSurveyCount === "number" && data.publicSurveyCount > 0) {
          return data.publicSurveyCount;
        }
      }
    } catch {
      // fallback
    }
  }

  const opinions = await getAnonymousOpinions();
  return opinions.length;
}

// -------------------------------------------------------------
// Aggregate Analytics Service
// -------------------------------------------------------------
export async function getAggregateStats(): Promise<AggregateStats> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          return data.stats as AggregateStats;
        }
      }
    } catch {
      // fallback
    }
  }

  const allFeedback = await getAllFeedback(true);
  const opinions = await getAnonymousOpinions();


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
    } else {
      categoryCounts.other++;
    }

    if (item.status === "pending") pendingCount++;
    else if (item.status === "under_review") underReviewCount++;
    else if (item.status === "addressed") addressedCount++;
    else if (item.status === "resolved") resolvedCount++;

    if (item.priority === "high") highPriorityCount++;
    else if (item.priority === "medium") mediumPriorityCount++;
    else if (item.priority === "low") lowPriorityCount++;
  }

  // Survey Analytics Calculation
  let yesCount = 0;
  let noCount = 0;
  let realSurveysCount = 0;
  let demoSurveysCount = 0;

  const expectationCountMap: Record<string, number> = {};
  const noReasonCountMap: Record<string, number> = {};
  const dateWiseMap: Record<string, { yes: number; no: number; total: number }> = {};

  for (const op of opinions) {
    const isReal = op.isDemo !== true;
    if (isReal) realSurveysCount++;
    else demoSurveysCount++;

    const isYes = op.voteChoice === "yes" || op.selectedOption === "support";
    if (isYes) {
      yesCount++;
    } else {
      noCount++;
    }

    // Expectations count
    if (op.expectations && Array.isArray(op.expectations)) {
      for (const exp of op.expectations) {
        expectationCountMap[exp] = (expectationCountMap[exp] || 0) + 1;
      }
    }

    // NO reasons count
    if (!isYes) {
      const reasonKey = op.noReasonPredefined || (op.noReasonCustom ? "व्यक्तिगत कारण दिया" : "कारण नहीं बताया (छोड़ा गया)");
      noReasonCountMap[reasonKey] = (noReasonCountMap[reasonKey] || 0) + 1;
    }

    // Date-wise map
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

  // Compile top expectations
  const topExpectations: ExpectationItem[] = EXPECTATION_OPTIONS.map((opt) => {
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

  // Compile common NO reasons
  const commonNoReasons: NoReasonItem[] = Object.entries(noReasonCountMap)
    .map(([reason, count]) => ({
      reason,
      count,
      percent: noCount > 0 ? Math.round((count / noCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Date-wise trend sorted
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
      realSurveysCount,
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
// Site Content Service (CMS)
// -------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/content");
      if (response.ok) return (await response.json()) as SiteContent;
    } catch (error) {
      console.error("Failed to load site content from API:", error);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "site_content", "main_content");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteContent;
      }
    } catch (err) {
      console.warn("Firestore getSiteContent failed, using fallback:", err);
    }
  }
  return getLocalItem<SiteContent>(STORAGE_KEYS.CONTENT, memContent);
}

export async function updateSiteContent(
  newContent: Partial<SiteContent>,
  adminEmail: string
): Promise<SiteContent> {
  const response = await adminApiFetch("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates: newContent }),
  });
  await throwForApiError(response);
  const updated = (await response.json()) as SiteContent;
  setLocalItem(STORAGE_KEYS.CONTENT, updated);
  memContent = updated;

  await recordAuditLog({
    adminEmail,
    action: "UPDATE_SITE_CONTENT",
    targetId: "site_content/main_content",
    details: "Updated website content and village priorities.",
  });

  return updated;
}

// -------------------------------------------------------------
// Admin Feedback Management
// -------------------------------------------------------------
export async function updateFeedbackItem(
  feedbackId: string,
  updates: {
    status?: FeedbackStatus;
    moderationStatus?: ModerationStatus;
    internalNotes?: string;
    priority?: "low" | "medium" | "high";
    category?: ProblemCategory;
  },
  adminEmail: string
): Promise<PublicFeedback | null> {
  const all = await getAllFeedback(true);
  const index = all.findIndex((f) => f.feedbackId === feedbackId);
  if (index === -1) return null;

  const response = await adminApiFetch("/api/feedback", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedbackId, updates }),
  });
  await throwForApiError(response);

  const updatedItem: PublicFeedback = {
    ...all[index],
    ...updates,
  };
  all[index] = updatedItem;

  setLocalItem(STORAGE_KEYS.FEEDBACK, all);
  memFeedback = all;

  await recordAuditLog({
    adminEmail,
    action: "UPDATE_FEEDBACK",
    targetId: feedbackId,
    details: `Updated feedback status to ${updates.status || all[index].status}, moderation: ${updates.moderationStatus || all[index].moderationStatus}`,
  });

  return updatedItem;
}

// -------------------------------------------------------------
// Audit Logging
// -------------------------------------------------------------
export async function recordAuditLog(log: Omit<AuditLog, "logId" | "timestamp">): Promise<void> {
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const fullLog: AuditLog = {
    ...log,
    logId,
    timestamp: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "audit_logs", logId), fullLog);
    } catch (e) {
      console.warn("Firestore save audit log failed:", e);
    }
  }

  const logs = getLocalItem<AuditLog[]>(STORAGE_KEYS.LOGS, memLogs);
  logs.unshift(fullLog);
  setLocalItem(STORAGE_KEYS.LOGS, logs.slice(0, 200));
  memLogs = logs;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "audit_logs");
      const q = query(colRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const items: AuditLog[] = [];
      snapshot.forEach((d) => items.push(d.data() as AuditLog));
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore read audit logs failed:", err);
    }
  }
  return getLocalItem<AuditLog[]>(STORAGE_KEYS.LOGS, memLogs);
}

// -------------------------------------------------------------
// CSV Export Generators
// -------------------------------------------------------------
export function generateFeedbackCSV(feedbackList: PublicFeedback[]): string {
  const headers = [
    "Feedback ID",
    "Category",
    "Priority",
    "Status",
    "Ward",
    "Description",
    "Suggested Improvement",
    "Village Development Suggestion",
    "Moderation Status",
    "Created Date",
    "Internal Notes",
  ];

  const escapeCSV = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""').replace(/\r\n/g, " ").replace(/\n/g, " ");
    return `"${clean}"`;
  };

  const rows = feedbackList.map((item) => [
    escapeCSV(item.feedbackId),
    escapeCSV(item.category),
    escapeCSV(item.priority),
    escapeCSV(item.status),
    escapeCSV(item.ward),
    escapeCSV(item.description),
    escapeCSV(item.suggestedImprovement),
    escapeCSV(item.villageDevelopmentSuggestion),
    escapeCSV(item.moderationStatus),
    escapeCSV(new Date(item.createdAt).toLocaleDateString("hi-IN")),
    escapeCSV(item.internalNotes),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function generateContactsCSV(contactsList: FollowupRequest[]): string {
  const headers = [
    "Request ID",
    "Full Name",
    "Father Name",
    "Mobile Number",
    "Locality/Ward",
    "Preferred Contact Method",
    "Subject or Problem",
    "Status",
    "Consent Given",
    "Created Date",
    "Admin Notes",
  ];

  const escapeCSV = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""').replace(/\r\n/g, " ").replace(/\n/g, " ");
    return `"${clean}"`;
  };

  const rows = contactsList.map((item) => [
    escapeCSV(item.requestId),
    escapeCSV(item.fullName || item.contactName),
    escapeCSV(item.fatherName),
    escapeCSV(item.mobileNumber || item.contactPhone),
    escapeCSV(item.locality || item.ward),
    escapeCSV(item.preferredContactMethod || "phone"),
    escapeCSV(item.subjectOrProblem),
    escapeCSV(item.status || "new"),
    escapeCSV(item.consentToContact ? "Yes (स्वीकृत)" : "No"),
    escapeCSV(new Date(item.createdAt).toLocaleDateString("hi-IN")),
    escapeCSV(item.adminNotes),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function generateSurveyAggregateCSV(stats: AggregateStats): string {
  const lines: string[] = [];

  lines.push("बुड़ीवाड़ा सरपंच चुनाव 2026 - सर्वे सांख्यिकी रिपोर्ट");
  lines.push(`रिपोर्ट दिनांक,${new Date().toLocaleDateString("hi-IN")}`);
  lines.push("");
  lines.push("सर्वे सारांश (Survey Summary)");
  lines.push(`कुल सर्वे प्रविष्टियाँ,${stats.surveyStats.totalSurveys}`);
  lines.push(`वास्तविक ग्रामवासी प्रविष्टियाँ,${stats.surveyStats.realSurveysCount}`);
  lines.push(`डेमो/परीक्षण प्रविष्टियाँ,${stats.surveyStats.demoSurveysCount}`);
  lines.push(`हाँ (समर्थन) कुल संख्या,${stats.surveyStats.yesCount}`);
  lines.push(`हाँ (समर्थन) प्रतिशत,${stats.surveyStats.yesPercent}%`);
  lines.push(`नहीं (असहमत/अन्य) कुल संख्या,${stats.surveyStats.noCount}`);
  lines.push(`नहीं प्रतिशत,${stats.surveyStats.noPercent}%`);
  lines.push("");
  lines.push("ग्रामवासियों की शीर्ष अपेक्षाएँ (Top Expectations)");
  lines.push("प्राथमिकता क्षेत्र,समर्थक संख्या,प्रतिशत");
  for (const exp of stats.surveyStats.topExpectations) {
    lines.push(`"${exp.labelHi}",${exp.count},${exp.percent}%`);
  }
  lines.push("");
  lines.push("असहमत उत्तरदाताओं द्वारा चुने गए कारण (Common NO Reasons)");
  lines.push("कारण,संख्या,प्रतिशत");
  for (const r of stats.surveyStats.commonNoReasons) {
    lines.push(`"${r.reason.replace(/"/g, '""')}",${r.count},${r.percent}%`);
  }

  return lines.join("\n");
}

export async function submitPostVoteDetail(params: {
  relatedSurveyId?: string;
  pollId?: string;
  pollOptionId?: string;
  voteChoiceLabel?: string;
  fullName?: string;
  fatherName?: string;
  mobileNumber?: string;
  locality?: string;
  notes?: string;
}): Promise<{ id: string }> {
  let id = `pvd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/voters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.id) id = data.id;
      }
    } catch (e) {
      console.warn("Save voter detail fallback:", e);
    }
  }

  const timestamp = new Date().toISOString();
  const newDetail: PostVoteDetail = {
    id,
    relatedSurveyId: params.relatedSurveyId,
    pollId: params.pollId,
    pollOptionId: params.pollOptionId,
    voteChoiceLabel: params.voteChoiceLabel,
    fullName: params.fullName?.trim() || "",
    fatherName: params.fatherName?.trim() || "",
    mobileNumber: params.mobileNumber?.trim() || "",
    locality: params.locality?.trim() || "",
    notes: params.notes?.trim() || "",
    createdAt: timestamp,
    isDemo: false,
  };

  const all = getLocalItem<PostVoteDetail[]>(STORAGE_KEYS.POST_VOTE_DETAILS, memPostVoteDetails);
  all.unshift(newDetail);
  setLocalItem(STORAGE_KEYS.POST_VOTE_DETAILS, all);
  memPostVoteDetails = all;

  return { id };
}

export async function getPostVoteDetails(): Promise<PostVoteDetail[]> {
  if (typeof window !== "undefined") {
    const res = await adminApiFetch("/api/voters");
    await throwForApiError(res);
    const data = await res.json();
    if (data.voters && Array.isArray(data.voters)) {
      return data.voters;
    }
  }
  return [];
}

export function generatePostVoteDetailsCSV(details: PostVoteDetail[]): string {
  const headers = [
    "ID",
    "Full Name (पूरा नाम)",
    "Father's Name (पिता का नाम)",
    "Mobile Number (मोबाइल)",
    "Ward / Locality (वार्ड/मोहल्ला)",
    "Additional Notes (अन्य विवरण)",
    "Submitted Date (दिनांक)",
  ];

  const escapeCSV = (str: string | undefined) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""').replace(/\r\n/g, " ").replace(/\n/g, " ");
    return `"${clean}"`;
  };

  const rows = details.map((d) => [
    escapeCSV(d.id),
    escapeCSV(d.fullName || "—"),
    escapeCSV(d.fatherName || "—"),
    escapeCSV(d.mobileNumber || "—"),
    escapeCSV(d.locality || "—"),
    escapeCSV(d.notes || "—"),
    escapeCSV(new Date(d.createdAt).toLocaleDateString("hi-IN")),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}


// -------------------------------------------------------------
// Admin-Only Polls Management Service
// -------------------------------------------------------------
export async function getAllPolls(): Promise<PollItem[]> {
  if (typeof window !== "undefined") {
    const res = await adminApiFetch("/api/polls");
    await throwForApiError(res);
    const data = await res.json();
    if (data.polls && Array.isArray(data.polls)) {
      setLocalItem(STORAGE_KEYS.POLLS, data.polls);
      return data.polls;
    }
  }

  return [];
}

export async function getActivePoll(): Promise<PollItem> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/polls/active");
      if (res.ok) {
        const data = await res.json();
        if (data.activePoll) {
          return data.activePoll;
        }
      }
    } catch {
      // fallback
    }
  }

  const polls = getLocalItem<PollItem[]>(STORAGE_KEYS.POLLS, memPolls);
  return polls.find((poll) => poll.isActive && poll.options.length === 2) ||
    demoPolls.find((poll) => poll.isActive && poll.options.length === 2) ||
    demoPolls[0];
}

export async function createPoll(
  params: {
    titleHi: string;
    titleEn: string;
    descriptionHi?: string;
    descriptionEn?: string;
    options: { textHi: string; textEn: string }[];
    setActive?: boolean;
  },
  adminEmail: string
): Promise<PollItem> {
  const response = await adminApiFetch("/api/polls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  await throwForApiError(response);
  const result = await response.json();
  const newPoll = result.poll as PollItem;
  const polls = [newPoll, ...(await getAllPolls()).filter((poll) => poll.id !== newPoll.id)];
  setLocalItem(STORAGE_KEYS.POLLS, polls);
  memPolls = polls;

  await recordAuditLog({
    adminEmail,
    action: "CREATE_POLL",
    targetId: newPoll.id,
    details: `Created new poll: ${newPoll.titleHi} (Active: ${newPoll.isActive})`,
  });

  return newPoll;
}

export async function setActivePoll(pollId: string, adminEmail: string): Promise<void> {
  const response = await adminApiFetch("/api/polls", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId, action: "setActive" }),
  });
  await throwForApiError(response);
  const polls = (await getAllPolls()).map((poll) => ({ ...poll, isActive: poll.id === pollId }));
  setLocalItem(STORAGE_KEYS.POLLS, polls);
  memPolls = polls;

  await recordAuditLog({
    adminEmail,
    action: "SET_ACTIVE_POLL",
    targetId: pollId,
    details: `Set poll ${pollId} as active`,
  });
}

export async function togglePollStatus(pollId: string, adminEmail: string): Promise<void> {
  const response = await adminApiFetch("/api/polls", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId, action: "toggle" }),
  });
  await throwForApiError(response);
  const polls = await getAllPolls();
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return;

  poll.isActive = !poll.isActive;

  setLocalItem(STORAGE_KEYS.POLLS, polls);
  memPolls = polls;

  await recordAuditLog({
    adminEmail,
    action: "TOGGLE_POLL_STATUS",
    targetId: pollId,
    details: `Toggled poll ${pollId} status to active: ${poll.isActive}`,
  });
}

export async function deletePoll(pollId: string, adminEmail: string): Promise<boolean> {
  const pollsBeforeDelete = await getAllPolls();
  const target = pollsBeforeDelete.find((poll) => poll.id === pollId);
  if (!target || target.isDefault) return false;

  const response = await adminApiFetch(`/api/polls?pollId=${encodeURIComponent(pollId)}`, {
    method: "DELETE",
  });
  if (response.status === 400) return false;
  await throwForApiError(response);

  const filtered = pollsBeforeDelete.filter((p) => p.id !== pollId);
  if (target.isActive && filtered.length > 0) {
    filtered[0].isActive = true;
  }

  setLocalItem(STORAGE_KEYS.POLLS, filtered);
  memPolls = filtered;

  await recordAuditLog({
    adminEmail,
    action: "DELETE_POLL",
    targetId: pollId,
    details: `Deleted poll: ${target.titleHi}`,
  });

  return true;
}
