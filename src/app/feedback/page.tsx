"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { submitPublicFeedback } from "@/lib/dataService";
import { ProblemCategory, ProblemPriority } from "@/types";
import {
  MessageSquarePlus,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  GraduationCap,
  HeartPulse,
  Briefcase,
  FileText,
  Sparkles,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function FeedbackPage() {
  const { t } = useLanguage();

  // Form state
  const [category, setCategory] = useState<ProblemCategory>("water");
  const [description, setDescription] = useState("");
  const [suggestedImprovement, setSuggestedImprovement] = useState("");
  const [priority, setPriority] = useState<ProblemPriority>("high");
  const [ward, setWard] = useState("");
  const [villageDevelopmentSuggestion, setVillageDevelopmentSuggestion] = useState("");

  // Consent-based follow-up contact state (strictly segregated)
  const [hasConsent, setHasConsent] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWard, setContactWard] = useState("");

  // Anti-spam math challenge
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Status & validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ feedbackId: string; followupId?: string } | null>(null);

  // Generate simple math captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaAnswer("");
  };

  const categories: { key: ProblemCategory; label: string; icon: React.ReactNode }[] = [
    { key: "water", label: t.catWater, icon: <Droplets className="w-4 h-4 text-blue-600" /> },
    { key: "roads", label: t.catRoads, icon: <Milestone className="w-4 h-4 text-amber-700" /> },
    { key: "drainage", label: t.catDrainage, icon: <Waves className="w-4 h-4 text-cyan-600" /> },
    { key: "streetlights", label: t.catStreetlights, icon: <Lightbulb className="w-4 h-4 text-yellow-600" /> },
    { key: "education", label: t.catEducation, icon: <GraduationCap className="w-4 h-4 text-indigo-600" /> },
    { key: "health", label: t.catHealth, icon: <HeartPulse className="w-4 h-4 text-rose-600" /> },
    { key: "employment", label: t.catEmployment, icon: <Briefcase className="w-4 h-4 text-purple-600" /> },
    { key: "govSchemes", label: t.catGovSchemes, icon: <FileText className="w-4 h-4 text-teal-600" /> },
    { key: "cleanliness", label: t.catCleanliness, icon: <Sparkles className="w-4 h-4 text-emerald-600" /> },
    { key: "other", label: t.catOther, icon: <HelpCircle className="w-4 h-4 text-slate-600" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "कृपया समस्या का कम से कम 10 अक्षरों में स्पष्ट विवरण लिखें।";
    }
    if (!suggestedImprovement.trim() || suggestedImprovement.trim().length < 5) {
      newErrors.suggestedImprovement = "कृपया अपेक्षित सुधार या समाधान का संक्षेप में उल्लेख करें।";
    }

    // Check anti-spam captcha
    if (parseInt(captchaAnswer.trim(), 10) !== num1 + num2) {
      newErrors.captcha = "सुरक्षा प्रश्न का उत्तर सही नहीं है। कृपया पुनः प्रयास करें।";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const result = await submitPublicFeedback({
        category,
        description,
        suggestedImprovement,
        priority,
        ward,
        villageDevelopmentSuggestion,
        followup: hasConsent
          ? {
              contactName: contactName.trim() || undefined,
              contactPhone: contactPhone.trim() || undefined,
              ward: contactWard.trim() || ward.trim() || undefined,
              consentToContact: true,
            }
          : undefined,
      });

      setSuccessInfo(result);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setErrors({ form: "सबमिट करने में त्रुटि आई। कृपया पुनः प्रयास करें।" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setSuggestedImprovement("");
    setWard("");
    setVillageDevelopmentSuggestion("");
    setHasConsent(false);
    setContactName("");
    setContactPhone("");
    setContactWard("");
    generateCaptcha();
    setSubmitted(false);
    setSuccessInfo(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-village-100 text-village-800 text-xs font-semibold border border-village-200">
              <MessageSquarePlus className="w-3.5 h-3.5 text-village-700" />
              <span>जन-सहभागिता एवं समस्या निवारण</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {t.feedbackFormTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              {t.feedbackFormSubtitle}
            </p>
          </div>

          {/* Privacy Assurance Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
            <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">गोपनीयता और पारदर्शिता का वचन:</span>
              <p className="text-emerald-800 leading-relaxed">
                यह समस्या रिपोर्ट मूल रूप से अनाम है। यदि आप नीचे स्वेच्छा से संपर्क विवरण देते हैं, तो वह भी एक पृथक डेटाबेस में रखा जाएगा और कभी किसी राजनीतिक राय से नहीं जोड़ा जाएगा।
              </p>
            </div>
          </div>

          {/* SUCCESS MODAL / SCREEN */}
          {submitted ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi">
                  {t.feedbackSuccessTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                  {t.feedbackSuccessMsg}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-xs text-slate-500 font-mono">
                प्रविष्टि संदर्भ क्रमांक: <span className="font-bold text-slate-800">{successInfo?.feedbackId}</span>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={resetForm}
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-village-700 hover:bg-village-800 text-white font-semibold text-sm shadow transition-all"
                >
                  {t.btnSubmitAnother}
                </button>
                <Link
                  href="/issues"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
                >
                  दर्ज की गई प्राथमिकताओं के आंकड़े देखें
                </Link>
              </div>
            </div>
          ) : (
            /* FORM CARD */
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
              {errors.form && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* 1. Category Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  {t.labelCategory}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {categories.map((cat) => {
                    const isSelected = category === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setCategory(cat.key)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-village-50 border-village-600 ring-2 ring-village-600 text-village-900 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100">{cat.icon}</div>
                        <span className="text-xs leading-snug">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ward / Area / Mohalla */}
              <div className="space-y-2">
                <label htmlFor="ward" className="block text-sm font-bold text-slate-900">
                  वार्ड नंबर या मोहल्ला (वैकल्पिक)
                </label>
                <input
                  id="ward"
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="उदा. वार्ड नं. 4, बस स्टैंड के पास, पूर्वी ढाणी..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-village-600 focus:ring-1 focus:ring-village-600 outline-none"
                />
              </div>

              {/* 2. Detailed Problem Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="description" className="block text-sm font-bold text-slate-900">
                    {t.labelDescription}
                  </label>
                  <span className="text-xs text-slate-400">
                    {description.length} / 1000 अक्षर
                  </span>
                </div>
                <textarea
                  id="description"
                  rows={4}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.placeholderDescription}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:border-village-600 focus:ring-1 focus:ring-village-600 outline-none ${
                    errors.description ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* 3. Desired Improvement */}
              <div className="space-y-2">
                <label htmlFor="improvement" className="block text-sm font-bold text-slate-900">
                  {t.labelImprovement}
                </label>
                <textarea
                  id="improvement"
                  rows={3}
                  maxLength={800}
                  value={suggestedImprovement}
                  onChange={(e) => setSuggestedImprovement(e.target.value)}
                  placeholder={t.placeholderImprovement}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:border-village-600 focus:ring-1 focus:ring-village-600 outline-none ${
                    errors.suggestedImprovement ? "border-rose-400 bg-rose-50/20" : "border-slate-300"
                  }`}
                />
                {errors.suggestedImprovement && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.suggestedImprovement}</span>
                  </p>
                )}
              </div>

              {/* 4. Priority / Urgency */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  {t.labelPriority}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      priority === "high"
                        ? "bg-rose-50 border-rose-400 ring-2 ring-rose-500 font-bold"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={priority === "high"}
                      onChange={() => setPriority("high")}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <div className="text-xs">
                      <span className="text-rose-900 block font-bold">{t.priorityHigh}</span>
                      <span className="text-slate-500">तत्काल ध्यान देने योग्य</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      priority === "medium"
                        ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500 font-bold"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={priority === "medium"}
                      onChange={() => setPriority("medium")}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <span className="text-amber-900 block font-bold">{t.priorityMedium}</span>
                      <span className="text-slate-500">मध्यम अवधि का समाधान</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      priority === "low"
                        ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500 font-bold"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={priority === "low"}
                      onChange={() => setPriority("low")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="text-emerald-900 block font-bold">{t.priorityLow}</span>
                      <span className="text-slate-500">दीर्घकालिक सुधार</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 5. Village Development Suggestion (Optional) */}
              <div className="space-y-2">
                <label htmlFor="devSuggestion" className="block text-sm font-bold text-slate-900">
                  {t.labelDevelopmentSuggestion}
                </label>
                <textarea
                  id="devSuggestion"
                  rows={2}
                  maxLength={500}
                  value={villageDevelopmentSuggestion}
                  onChange={(e) => setVillageDevelopmentSuggestion(e.target.value)}
                  placeholder={t.placeholderDevelopmentSuggestion}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-village-600 focus:ring-1 focus:ring-village-600 outline-none"
                />
              </div>

              {/* 6. STRICTLY SEPARATE CONSENT-BASED FOLLOW-UP SECTION */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-village-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {t.labelConsentSectionTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.labelConsentSectionDesc}
                  </p>
                </div>

                <label className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                    className="mt-0.5 rounded text-village-700 focus:ring-village-600 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-slate-800 leading-snug">
                    {t.labelConsentCheckbox}
                  </span>
                </label>

                {hasConsent && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.labelContactName}
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="आपका शुभ नाम"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-village-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.labelContactPhone}
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98290 XXXXX"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-village-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.labelWard}
                      </label>
                      <input
                        type="text"
                        value={contactWard}
                        onChange={(e) => setContactWard(e.target.value)}
                        placeholder="वार्ड / मोहल्ला"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-village-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. ANTI-SPAM MATH CAPTCHA */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    सुरक्षा सत्यापन (Spam Prevention):
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>नया प्रश्न</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-bold text-slate-800 font-mono">
                    {num1} + {num2} = ?
                  </span>
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="उत्तर यहाँ लिखें"
                    className="w-36 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-sm outline-none focus:border-amber-600"
                    required
                  />
                </div>
                {errors.captcha && (
                  <p className="text-xs text-rose-600 font-medium">{errors.captcha}</p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-village-700 hover:bg-village-800 active:scale-[0.99] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{t.submittingText}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.btnSubmitFeedback}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
