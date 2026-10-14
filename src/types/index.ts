export type ProblemCategory =
  | "water"
  | "roads"
  | "drainage"
  | "streetlights"
  | "education"
  | "health"
  | "employment"
  | "govSchemes"
  | "cleanliness"
  | "other";

export type ProblemPriority = "low" | "medium" | "high";

export type FeedbackStatus = "pending" | "under_review" | "addressed" | "resolved";

export type ModerationStatus = "pending" | "approved" | "hidden";

export type OpinionOption = "support" | "undecided" | "other";

export interface AnonymousOpinion {
  responseId: string;
  selectedOption: OpinionOption;
  createdAt: string;
}

export interface PublicFeedback {
  feedbackId: string;
  category: ProblemCategory;
  description: string;
  suggestedImprovement: string;
  priority: ProblemPriority;
  ward?: string;
  villageDevelopmentSuggestion?: string;
  moderationStatus: ModerationStatus;
  status: FeedbackStatus;
  internalNotes?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface FollowupRequest {
  requestId: string;
  relatedFeedbackId: string;
  contactName?: string;
  contactPhone?: string;
  ward?: string;
  consentToContact: boolean;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: "superadmin" | "admin" | "moderator";
  createdAt: string;
}

export interface VillagePriorityItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  qHi: string;
  qEn: string;
  aHi: string;
  aEn: string;
}

export interface AnnouncementItem {
  id: string;
  titleHi: string;
  titleEn: string;
  date: string;
  contentHi: string;
  contentEn: string;
  isUrgent?: boolean;
}

export interface SiteContent {
  candidateName: string;
  candidateCategory: string;
  village: string;
  candidatePhotoUrl?: string;
  bioHindi: string;
  bioEnglish: string;
  visionHindi: string;
  visionEnglish: string;
  priorities: VillagePriorityItem[];
  contact: {
    addressHi: string;
    addressEn: string;
    phone: string;
    email: string;
    visitingHoursHi: string;
    visitingHoursEn: string;
  };
  faqs: FAQItem[];
  announcements: AnnouncementItem[];
  updatedAt: string;
}

export interface AuditLog {
  logId: string;
  adminEmail: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface AggregateStats {
  totalFeedback: number;
  uniqueRecords: number;
  pendingCount: number;
  underReviewCount: number;
  addressedCount: number;
  resolvedCount: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  categoryCounts: Record<ProblemCategory, number>;
  opinionStats: {
    total: number;
    support: number;
    undecided: number;
    other: number;
    supportPercent: number;
    undecidedPercent: number;
    otherPercent: number;
  };
}
