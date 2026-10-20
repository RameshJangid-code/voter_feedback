"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  submitAnonymousSurvey,
  submitPostVoteDetail,
  getAggregateStats,
  getActivePoll,
} from "@/lib/dataService";
import { EXPECTATION_OPTIONS, NO_REASON_OPTIONS } from "@/lib/seedData";
import { VoteChoice, AggregateStats, PollItem } from "@/types";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  GraduationCap,
  HeartPulse,
  Briefcase,
  FileText,
  Sparkles,
  Eye,
  Users2,
  HelpCircle,
  PhoneCall,
  Home,
  BarChart3,
  User,
  TrendingUp,
} from "lucide-react";


export default function OpinionPage() {
  const { language, t } = useLanguage();

  // Step state:
  // 1 = Initial YES/NO question
  // 2 = Branching question (expectations or reasons)
  // 3 = Optional Details Form (नाम, पिता का नाम, संपर्क - वैकल्पिक)
  // 4 = Live Poll Results & Total Votes
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [voteChoice, setVoteChoice] = useState<VoteChoice | null>(null);
  const [surveyResponseId, setSurveyResponseId] = useState<string>("");
  // Poll linkage: stored after vote is cast, passed to post-vote details
  const [votedPollId, setVotedPollId] = useState<string>("");
  const [votedOptionId, setVotedOptionId] = useState<string>("");

  // YES branch state
  const [selectedExpectations, setSelectedExpectations] = useState<string[]>([]);
  const [biggestExpectation, setBiggestExpectation] = useState<string>("");

  // NO branch state
  const [selectedNoReason, setSelectedNoReason] = useState<string>("");
  const [customNoReason, setCustomNoReason] = useState<string>("");

  // Optional Post-Vote Details State (name, fatherName, etc.)
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [locality, setLocality] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingDetails, setSubmittingDetails] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Poll Stats & Active Poll State
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [activePoll, setActivePoll] = useState<PollItem | null>(null);
  const [hasVotedBefore, setHasVotedBefore] = useState(false);

  // Load stats and check local vote status on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, pollData] = await Promise.all([
          getAggregateStats(),
          getActivePoll(),
        ]);
        setStats(statsData);
        setActivePoll(pollData);

        if (typeof window !== "undefined") {
          const voted = localStorage.getItem("budivada_voted_opinion_session");
          if (voted === "true") {
            setHasVotedBefore(true);
          }
        }
      } catch (e) {
        console.error("Failed to load survey stats:", e);
      }
    }
    loadData();
  }, []);

  const refreshStats = async () => {
    try {
      const statsData = await getAggregateStats();
      setStats(statsData);
    } catch (e) {
      console.error("Failed to refresh stats:", e);
    }
  };

  const getExpectationIcon = (key: string) => {
    switch (key) {
      case "water":
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case "roads":
        return <Milestone className="w-5 h-5 text-amber-700" />;
      case "drainage":
        return <Waves className="w-5 h-5 text-cyan-600" />;
      case "streetlights":
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case "education":
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case "health":
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case "employment":
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case "govSchemes":
        return <FileText className="w-5 h-5 text-teal-600" />;
      case "cleanliness":
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case "expenditure_transparency":
        return <Eye className="w-5 h-5 text-sky-700" />;
      case "public_meetings":
        return <Users2 className="w-5 h-5 text-village-700" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleSelectVote = (choice: VoteChoice) => {
    setVoteChoice(choice);
    setErrorMsg(null);
    setStep(2);
  };

  const toggleExpectation = (key: string) => {
    setSelectedExpectations((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Step 2 -> Step 3 (Submit survey anonymously, then show optional details)
  const handleSurveySubmit = async (isSkip = false) => {
    if (!voteChoice) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await submitAnonymousSurvey({
        voteChoice,
        expectations: voteChoice === "yes" ? selectedExpectations : undefined,
        biggestExpectation: voteChoice === "yes" ? biggestExpectation.trim() || undefined : undefined,
        noReasonPredefined: voteChoice === "no" && !isSkip ? selectedNoReason || undefined : undefined,
        noReasonCustom: voteChoice === "no" && !isSkip ? customNoReason.trim() || undefined : undefined,
      });

      setSurveyResponseId(result.responseId);
      // Store the poll+option linkage for post-vote details
      if (result.pollId) setVotedPollId(result.pollId);
      if (result.optionId) setVotedOptionId(result.optionId);

      // Mark local session
      if (typeof window !== "undefined") {
        localStorage.setItem("budivada_voted_opinion_session", "true");
        setHasVotedBefore(true);
      }

      await refreshStats();
      // Move to Step 3: Optional Voter Details form
      setStep(3);
    } catch (err) {
      console.error("Survey submission failed:", err);
      setErrorMsg("सर्वे सबमिट करने में त्रुटि आई। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };


  // Step 3 -> Step 4 (Save optional details if filled, then show results)
  const handleSavePostVoteDetails = async () => {
    setSubmittingDetails(true);
    try {
      if (fullName.trim() || fatherName.trim() || mobileNumber.trim() || locality.trim() || notes.trim()) {
        // Determine human-readable vote choice label for admin display
        const choiceLabel = voteChoice === "yes"
          ? "हाँ (समर्थन पर विचार)"
          : "नहीं (अन्य विकल्प / अनिर्णित)";

        await submitPostVoteDetail({
          relatedSurveyId: surveyResponseId || undefined,
          pollId: votedPollId || undefined,
          pollOptionId: votedOptionId || undefined,
          voteChoiceLabel: choiceLabel,
          fullName,
          fatherName,
          mobileNumber,
          locality,
          notes,
        });
      }
      await refreshStats();
      setStep(4);
    } catch (err) {
      console.error("Failed to save post-vote details:", err);
      // Still proceed to results so user isn't stuck
      setStep(4);
    } finally {
      setSubmittingDetails(false);
    }
  };


  const handleSkipDetails = () => {
    setStep(4);
  };

  const totalVotesDisplay = stats?.surveyStats.totalSurveys || 0;
  const yesVotesCount = stats?.surveyStats.yesCount || 0;
  const noVotesCount = stats?.surveyStats.noCount || 0;
  const yesPercent = stats?.surveyStats.yesPercent || 0;
  const noPercent = stats?.surveyStats.noPercent || 0;

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 font-hindi">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-village-100 text-village-900 text-xs font-semibold border border-village-200">
              <Vote className="w-3.5 h-3.5 text-village-700" />
              <span>{t.surveyTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === "hi" ? "अपनी गोपनीय राय साझा करें" : "Share Your Confidential Opinion"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.surveySubtitle}
            </p>

            {/* Total Votes Live Indicator on Poll Page */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                पोल पर कुल दर्ज मत: <strong className="text-village-800">{totalVotesDisplay}</strong>
              </span>
            </div>
          </div>

          {/* Already Voted Notice if user previously submitted in this session */}
          {hasVotedBefore && step === 1 && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>आप इस पोल में पहले ही अपना मत दर्ज कर चुके हैं।</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-3.5 py-1.5 rounded-xl bg-village-700 hover:bg-village-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>कुल परिणाम देखें (View Results)</span>
              </button>
            </div>
          )}

          {/* Privacy Guarantee Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block text-emerald-900">100% गोपनीय व अनाम सर्वे:</strong>
              <p className="text-emerald-800 leading-relaxed text-[11px] sm:text-xs">
                {t.surveyPrivacyNote}
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 1: INITIAL QUESTION (YES / NO)                           */}
          {/* ============================================================== */}
          {step === 1 && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-8">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-village-700 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
                    पहला प्रश्न • Question 1
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    कुल मत: {totalVotesDisplay}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {activePoll?.titleHi || t.surveyQ1}
                </h2>
                <p className="text-xs text-slate-500">
                  {activePoll?.descriptionHi || "कृपया नीचे दिए गए दो बड़े विकल्पों में से एक चुनें:"}
                </p>
              </div>

              {/* TWO LARGE TOUCH-FRIENDLY BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* YES Option */}
                <button
                  type="button"
                  onClick={() => handleSelectVote("yes")}
                  className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-village-50 hover:bg-village-700 hover:text-white border-3 border-village-600 text-village-900 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-village-600 text-white group-hover:bg-white group-hover:text-village-800 flex items-center justify-center shadow-md transition-colors">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-2xl font-black block tracking-wide">
                      {t.surveyVoteYes}
                    </span>
                    <span className="text-xs text-village-700 group-hover:text-emerald-100 font-medium">
                      हाँ, समर्थन पर विचार कर रहे हैं
                    </span>
                  </div>
                </button>

                {/* NO Option */}
                <button
                  type="button"
                  onClick={() => handleSelectVote("no")}
                  className="group flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-50 hover:bg-slate-800 hover:text-white border-3 border-slate-300 hover:border-slate-800 text-slate-800 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center space-y-3"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-300 text-slate-700 group-hover:bg-white group-hover:text-slate-800 flex items-center justify-center shadow-md transition-colors">
                    <span className="text-2xl font-bold">✕</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black block tracking-wide">
                      {t.surveyVoteNo}
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-slate-300 font-medium">
                      नहीं, अन्य विकल्प या विचार नहीं
                    </span>
                  </div>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span>(वोट देने के बाद आप कुल परिणाम देख सकेंगे)</span>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-village-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>सीधे परिणाम देखें</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2A: IF USER SELECTS YES (EXPECTATIONS LIST + TEXT BOX)    */}
          {/* ============================================================== */}
          {step === 2 && voteChoice === "yes" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    आपका चयन: हाँ (YES)
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>विकल्प बदलें</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {t.surveyYesQ2}
                </h2>
                <p className="text-xs text-slate-500">
                  नीचे दी गई प्राथमिकताओं में से जो आपके लिए महत्वपूर्ण हैं, उन पर टिक करें:
                </p>
              </div>

              {/* 12 SELECTABLE OPTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {EXPECTATION_OPTIONS.map((item) => {
                  const isChecked = selectedExpectations.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleExpectation(item.key)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                        isChecked
                          ? "bg-village-50 border-village-600 ring-2 ring-village-600/30 text-village-950 font-semibold"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? "bg-village-700 border-village-700 text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {getExpectationIcon(item.key)}
                        <span className="text-xs sm:text-sm">
                          {language === "hi" ? item.labelHi : item.labelEn}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* OPTIONAL BIGGEST EXPECTATION TEXT BOX */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800">
                  {t.surveyBiggestExpectationLabel}
                </label>
                <textarea
                  value={biggestExpectation}
                  onChange={(e) => setBiggestExpectation(e.target.value)}
                  placeholder={t.surveyBiggestExpectationPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm placeholder:text-slate-400"
                />
              </div>

              {/* ACTION BUTTONS: BACK & SUBMIT */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.btnBack}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSurveySubmit(false)}
                  disabled={submitting}
                  className="px-8 py-3.5 rounded-2xl bg-village-700 hover:bg-village-800 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सबमिट किया जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.btnSubmitSurvey}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2B: IF USER SELECTS NO (OPTIONAL REASONS + SKIP ALLOWED)   */}
          {/* ============================================================== */}
          {step === 2 && voteChoice === "no" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    आपका चयन: नहीं (NO)
                  </span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>विकल्प बदलें</span>
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {t.surveyNoQ2}
                </h2>
                <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  ध्यान दें: कारण बताना पूरी तरह <strong>वैकल्पिक (Optional)</strong> है। आप सीधे <strong>&quot;छोड़ें और सबमिट करें&quot;</strong> दबा सकते हैं।
                </p>
              </div>

              {/* PREDEFINED REASONS (OPTIONAL) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 block">
                  कारण चुनें (वैकल्पिक):
                </span>
                {NO_REASON_OPTIONS.map((reason) => {
                  const isSelected = selectedNoReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setSelectedNoReason(isSelected ? "" : reason)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-slate-100 border-slate-600 ring-2 ring-slate-400 font-semibold text-slate-900"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-slate-800 bg-slate-800" : "border-slate-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs sm:text-sm">{reason}</span>
                    </button>
                  );
                })}
              </div>

              {/* OPTIONAL CUSTOM REASON TEXT BOX */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  कोई अन्य कारण या विचार (वैकल्पिक):
                </label>
                <textarea
                  value={customNoReason}
                  onChange={(e) => setCustomNoReason(e.target.value)}
                  placeholder={t.surveyNoReasonPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm placeholder:text-slate-400"
                />
              </div>

              {/* ACTION BUTTONS: BACK, SKIP, SUBMIT */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.btnBack}</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSurveySubmit(true)}
                    disabled={submitting}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
                  >
                    {t.btnSkip}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSurveySubmit(false)}
                    disabled={submitting}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{t.btnSubmitSurvey}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: OPTIONAL VOTER DETAILS FORM (वोट देने के बाद नाम, पिता का नाम) */}
          {/* ============================================================== */}
          {step === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
              {/* Vote Success Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-emerald-950 text-base">
                    धन्यवाद! आपका मत सुरक्षित व गोपनीय दर्ज हो गया है।
                  </h3>
                  <p className="text-xs text-emerald-800">
                    आपकी राय दर्ज हो चुकी है। अब आप चाहें तो संपर्क हेतु अपना विवरण दे सकते हैं।
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-village-50 text-village-800 text-xs font-bold border border-village-200">
                  <User className="w-3.5 h-3.5 text-village-700" />
                  <span>वैकल्पिक विवरण (Optional Details)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  क्या आप अपना नाम व संपर्क विवरण साझा करना चाहते हैं?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  यह विवरण पूरी तरह <strong>वैकल्पिक (Optional)</strong> है। यदि आप इसे नहीं भरना चाहते तो सीधे <strong>&quot;छोड़ें और परिणाम देखें&quot;</strong> पर क्लिक करें। आपका दिया गया वोट पूरी तरह अनाम रहेगा।
                </p>
              </div>

              {/* Form Fields (Optional) */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      पूरा नाम (Full Name) <span className="text-slate-400 font-normal">- वैकल्पिक</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="उदा. रामनिवास सुथार"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm"
                    />
                  </div>

                  {/* Father's Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      पिता का नाम (Father&apos;s Name) <span className="text-slate-400 font-normal">- वैकल्पिक</span>
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="उदा. श्री कानाराम सुथार"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      मोबाइल नंबर (Mobile Number) <span className="text-slate-400 font-normal">- वैकल्पिक</span>
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm"
                    />
                  </div>

                  {/* Mohalla / Ward */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      मोहल्ला / ढाणी / वार्ड <span className="text-slate-400 font-normal">- वैकल्पिक</span>
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="उदा. वार्ड नं 3, मुख्य बाजार"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    कोई अन्य विवरण या संदेश (Additional Notes) <span className="text-slate-400 font-normal">- वैकल्पिक</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="कोई विशेष संदेश या सुझाव जो आप प्रत्याशी को देना चाहें"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-village-600 text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons: Save & View Results or Skip */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSkipDetails}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
                >
                  विवरण न देकर सीधे परिणाम देखें (Skip)
                </button>

                <button
                  type="button"
                  onClick={handleSavePostVoteDetails}
                  disabled={submittingDetails}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-village-700 hover:bg-village-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submittingDetails ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सुरक्षित किया जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <span>विवरण सुरक्षित करें और परिणाम देखें</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: LIVE POLL RESULTS SCREEN (वोट देने के बाद परिणाम + कुल मत) */}
          {/* ============================================================== */}
          {step === 4 && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
              {/* Result Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                  <BarChart3 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  बुड़ीवाड़ा जनमत पोल परिणाम
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  गाँव के नागरिकों द्वारा साझा की गई सामूहिक राय का सीधा सांख्यिकीय अवलोकन
                </p>
              </div>

              {/* TOTAL VOTES DISPLAY CARD */}
              <div className="bg-village-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg border border-village-800">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>पोल पर कुल दर्ज मत (Total Poll Votes)</span>
                </div>
                <div className="text-5xl sm:text-6xl font-black text-amber-300 tracking-tight">
                  {totalVotesDisplay}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                  बुड़ीवाड़ा ग्राम पंचायत के नागरिकों द्वारा अब तक दर्ज कराए गए कुल मत
                </p>

                {/* YES / NO Breakdown Bars */}
                <div className="pt-4 space-y-4 max-w-lg mx-auto text-left">
                  {/* YES Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                        <span>हाँ (समर्थन विचार):</span>
                      </span>
                      <span className="text-white font-mono">
                        {yesVotesCount} मत ({yesPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(yesPercent, 2)}%` }}
                      />
                    </div>
                  </div>

                  {/* NO Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span>✕</span>
                        <span>नहीं (अन्य विकल्प/अनिर्णित):</span>
                      </span>
                      <span className="text-slate-300 font-mono">
                        {noVotesCount} मत ({noPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="bg-slate-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(noPercent, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TOP EXPECTATIONS BREAKDOWN */}
              {stats?.surveyStats.topExpectations && stats.surveyStats.topExpectations.length > 0 && (
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-village-700" />
                      <span>गाँव के लोगों की मुख्य अपेक्षाएँ (Top Expectations)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">समर्थकों द्वारा चयनित</span>
                  </div>

                  <div className="space-y-3">
                    {stats.surveyStats.topExpectations.slice(0, 5).map((exp, idx) => (
                      <div key={exp.key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-village-100 text-village-800 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{language === "hi" ? exp.labelHi : exp.labelEn}</span>
                          </span>
                          <span className="text-village-700 font-mono">
                            {exp.count} नागरिक ({exp.percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-village-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(exp.percent, 3)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notice & Privacy Note */}
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-slate-700 text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-village-700 shrink-0 mt-0.5" />
                <p>
                  <strong>गोपनीयता की गारंटी:</strong> सभी मत पूर्णतः सुरक्षित हैं। यह पोल केवल ग्राम पंचायत बुड़ीवाड़ा के विकास एवं जन-अपेक्षाओं को समझने के लिए संचालित किया जा रहा है।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/feedback"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-village-700 hover:bg-village-800 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2"
                >
                  <span>गाँव की समस्या बताएं</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-village-950 font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-village-950" />
                  <span>संपर्क अनुरोध दर्ज करें</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setVoteChoice(null);
                    setStep(1);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Vote className="w-3.5 h-3.5" />
                  <span>पुनः मत दर्ज करें</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>मुख्य पृष्ठ पर वापस जाएँ</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
