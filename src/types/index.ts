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

export type OpinionOption = "support" | "undecided" | "other" | "yes" | "no";

export type VoteChoice = "yes" | "no";

export interface AnonymousSurvey {
  responseId: string;
  voteChoice: VoteChoice; // "yes" or "no"
  // If YES:
  expectations?: string[]; // Array of selected expectation keys
  biggestExpectation?: string; // Optional custom text for biggest expectation
  // If NO:
  noReasonPredefined?: string; // Optional predefined reason
  noReasonCustom?: string; // Optional custom text for why not voting
  createdAt: string;
  isDemo?: boolean; // true if demo/seed data, false or undefined for real submitted records
}

// Extends AnonymousOpinion for backward compatibility with existing components
export interface AnonymousOpinion {
  responseId: string;
  selectedOption?: OpinionOption;
  voteChoice?: VoteChoice;
  expectations?: string[];
  biggestExpectation?: string;
  noReasonPredefined?: string;
  noReasonCustom?: string;
  createdAt: string;
  isDemo?: boolean;
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
  isDemo?: boolean;
}

export type PreferredContactMethod = "phone" | "whatsapp" | "in_person";

export interface FollowupRequest {
  requestId: string;
  relatedFeedbackId?: string;
  fullName: string;
  fatherName?: string;
  mobileNumber: string;
  locality?: string;
  preferredContactMethod?: PreferredContactMethod;
  subjectOrProblem?: string;
  consentToContact: boolean;
  createdAt: string;
  status?: "new" | "contacted" | "in_progress" | "resolved";
  adminNotes?: string;
  isDemo?: boolean;
  // Aliases for backward compatibility
  contactName?: string;
  contactPhone?: string;
  ward?: string;
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

export interface ExpectationItem {
  key: string;
  labelHi: string;
  labelEn: string;
  count: number;
  percent: number;
}

export interface NoReasonItem {
  reason: string;
  count: number;
  percent: number;
}

export interface SurveyAggregateStats {
  totalSurveys: number;
  realSurveysCount: number;
  demoSurveysCount: number;
  yesCount: number;
  noCount: number;
  yesPercent: number;
  noPercent: number;
  topExpectations: ExpectationItem[];
  commonNoReasons: NoReasonItem[];
  dateWiseTrend: { date: string; yes: number; no: number; total: number }[];
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
  surveyStats: SurveyAggregateStats;
}

export interface PostVoteDetail {
  id: string;
  relatedSurveyId?: string;   // optional link to the anonymous opinion responseId
  pollId?: string;            // which poll was voted on
  pollOptionId?: string;      // which option was chosen (for admin reference only)
  voteChoiceLabel?: string;   // human-readable label e.g. "हाँ (समर्थन पर विचार)"
  fullName?: string;
  fatherName?: string;
  mobileNumber?: string;
  locality?: string;
  notes?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface PollOption {
  id: string;
  textHi: string;
  textEn: string;
  votesCount?: number;
}

export interface PollItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi?: string;
  descriptionEn?: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: string;
  totalVotes?: number;
  isDefault?: boolean;
}
