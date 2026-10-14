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
  OpinionOption,
} from "@/types";
import { defaultSiteContent } from "./initialContent";
import { demoPublicFeedback, demoFollowups, demoAnonymousOpinions } from "./seedData";
import { isFirebaseConfigured, db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
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
};

// In-memory fallback if server-side rendering or localStorage not available
let memFeedback: PublicFeedback[] = [...demoPublicFeedback];
let memFollowups: FollowupRequest[] = [...demoFollowups];
let memOpinions: AnonymousOpinion[] = [...demoAnonymousOpinions];
let memContent: SiteContent = { ...defaultSiteContent };
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
    contactName?: string;
    contactPhone?: string;
    ward?: string;
    consentToContact: boolean;
  };
}): Promise<{ feedbackId: string; followupId?: string }> {
  const timestamp = new Date().toISOString();
  const feedbackId = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newFeedback: PublicFeedback = {
    feedbackId,
    category: params.category,
    description: params.description.trim(),
    suggestedImprovement: params.suggestedImprovement.trim(),
    priority: params.priority,
    ward: params.ward?.trim() || "",
    villageDevelopmentSuggestion: params.villageDevelopmentSuggestion?.trim() || "",
    moderationStatus: "approved", // default approved for public viewing
    status: "pending",
    internalNotes: "",
    createdAt: timestamp,
    isPublic: true,
  };

  let followupId: string | undefined;

  // Stored strictly in separate followup_requests collection if consented
  if (params.followup && params.followup.consentToContact) {
    followupId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newFollowup: FollowupRequest = {
      requestId: followupId,
      relatedFeedbackId: feedbackId,
      contactName: params.followup.contactName?.trim() || "नाम नहीं दिया",
      contactPhone: params.followup.contactPhone?.trim() || "",
      ward: params.followup.ward?.trim() || params.ward || "",
      consentToContact: true,
      createdAt: timestamp,
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "followup_requests", followupId), newFollowup);
      } catch (e) {
        console.warn("Firestore save followup failed, saving locally:", e);
      }
    }
    const currentFollowups = getLocalItem<FollowupRequest[]>(STORAGE_KEYS.FOLLOWUPS, memFollowups);
    currentFollowups.unshift(newFollowup);
    setLocalItem(STORAGE_KEYS.FOLLOWUPS, currentFollowups);
    memFollowups = currentFollowups;
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "public_feedback", feedbackId), newFeedback);
    } catch (e) {
      console.warn("Firestore save feedback failed, saving locally:", e);
    }
  }

  const currentFeedback = getLocalItem<PublicFeedback[]>(STORAGE_KEYS.FEEDBACK, memFeedback);
  currentFeedback.unshift(newFeedback);
  setLocalItem(STORAGE_KEYS.FEEDBACK, currentFeedback);
  memFeedback = currentFeedback;

  return { feedbackId, followupId };
}

// -------------------------------------------------------------
// Anonymous Opinion Poll Service
// (Strict privacy: NO names, NO phone numbers, NO device IDs)
// -------------------------------------------------------------
export async function submitAnonymousOpinion(selectedOption: OpinionOption): Promise<{ responseId: string }> {
  const timestamp = new Date().toISOString();
  const responseId = `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newOpinion: AnonymousOpinion = {
    responseId,
    selectedOption,
    createdAt: timestamp,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "anonymous_opinions", responseId), newOpinion);
    } catch (e) {
      console.warn("Firestore save opinion failed, saving locally:", e);
    }
  }

  const currentOpinions = getLocalItem<AnonymousOpinion[]>(STORAGE_KEYS.OPINIONS, memOpinions);
  currentOpinions.unshift(newOpinion);
  setLocalItem(STORAGE_KEYS.OPINIONS, currentOpinions);
  memOpinions = currentOpinions;

  return { responseId };
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

// -------------------------------------------------------------
// Followup Requests (Admin Only)
// -------------------------------------------------------------
export async function getFollowupRequests(): Promise<FollowupRequest[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, "followup_requests");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: FollowupRequest[] = [];
      snapshot.forEach((d) => items.push(d.data() as FollowupRequest));
      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore read followups failed:", err);
    }
  }
  return getLocalItem<FollowupRequest[]>(STORAGE_KEYS.FOLLOWUPS, memFollowups);
}

// -------------------------------------------------------------
// Aggregate Analytics Service
// -------------------------------------------------------------
export async function getAggregateStats(): Promise<AggregateStats> {
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

  let support = 0;
  let undecided = 0;
  let other = 0;

  for (const op of opinions) {
    if (op.selectedOption === "support") support++;
    else if (op.selectedOption === "undecided") undecided++;
    else if (op.selectedOption === "other") other++;
  }

  const totalOpinions = opinions.length;
  const supportPercent = totalOpinions > 0 ? Math.round((support / totalOpinions) * 100) : 0;
  const undecidedPercent = totalOpinions > 0 ? Math.round((undecided / totalOpinions) * 100) : 0;
  const otherPercent = totalOpinions > 0 ? Math.round((other / totalOpinions) * 100) : 0;

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
      total: totalOpinions,
      support,
      undecided,
      other,
      supportPercent,
      undecidedPercent,
      otherPercent,
    },
  };
}

// -------------------------------------------------------------
// Site Content Service (CMS)
// -------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
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
  const current = await getSiteContent();
  const updated: SiteContent = {
    ...current,
    ...newContent,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "site_content", "main_content");
      await setDoc(docRef, updated, { merge: true });
    } catch (e) {
      console.warn("Firestore update content failed:", e);
    }
  }

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

  const updatedItem: PublicFeedback = {
    ...all[index],
    ...updates,
  };
  all[index] = updatedItem;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "public_feedback", feedbackId);
      await updateDoc(docRef, updates);
    } catch (e) {
      console.warn("Firestore update feedback failed:", e);
    }
  }

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
  setLocalItem(STORAGE_KEYS.LOGS, logs.slice(0, 200)); // retain recent 200
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
// CSV Export Generator
// (Clean, safe escaping without leaking anonymous opinions)
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
