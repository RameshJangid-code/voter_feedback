"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { submitContactRequest } from "@/lib/dataService";
import { PreferredContactMethod } from "@/types";
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  Phone,
  MessageSquare,
  Users,
  Home,
  MessageSquarePlus,
} from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [locality, setLocality] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>("phone");
  const [subjectOrProblem, setSubjectOrProblem] = useState("");
  const [consentToContact, setConsentToContact] = useState(false);

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "कृपया अपना पूरा नाम लिखें।";
    }

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.mobileNumber = "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।";
    }

    if (!consentToContact) {
      errs.consent = "संपर्क किए जाने की सहमति के लिए कृपया चेकबॉक्स पर टिक करें।";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      await submitContactRequest({
        fullName: fullName.trim(),
        fatherName: fatherName.trim() || undefined,
        mobileNumber: mobileNumber.trim(),
        locality: locality.trim() || undefined,
        preferredContactMethod,
        subjectOrProblem: subjectOrProblem.trim() || undefined,
        consentToContact: true,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Contact request submission error:", err);
      setErrors({ form: "अनुरोध दर्ज करने में त्रुटि आई। कृपया पुनः प्रयास करें।" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setFatherName("");
    setMobileNumber("");
    setLocality("");
    setPreferredContactMethod("phone");
    setSubjectOrProblem("");
    setConsentToContact(false);
    setSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 font-hindi">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-village-100 text-village-900 text-xs font-semibold border border-village-200">
              <PhoneCall className="w-3.5 h-3.5 text-village-700" />
              <span>{t.contactFormTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              समस्या निवारण एवं व्यक्तिगत संवाद अनुरोध
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.contactFormSubtitle}
            </p>
          </div>

          {/* Privacy & Segregation Guarantee Notice */}
          <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 flex items-start gap-3.5 text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-900 font-bold block">
                गोपनीयता एवं पृथक्करण नीति:
              </strong>
              <p className="text-emerald-800 leading-relaxed text-[11px] sm:text-xs">
                {t.contactFormDisclaimer}
              </p>
            </div>
          </div>

          {!submitted ? (
            /* FORM */
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-5"
            >
              {errors.form && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelFullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. रमेश सिंह / मोहनलाल"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                      : "border-slate-300 focus:ring-village-600"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errors.fullName}</p>
                )}
              </div>

              {/* 2. Father's Name (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelFatherName}
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="उदा. श्री कानसिंह जी"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-village-600"
                />
              </div>

              {/* 3. Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelMobileNumber}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="उदा. 98290 12345"
                  maxLength={15}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.mobileNumber
                      ? "border-rose-400 focus:ring-rose-400 bg-rose-50/30"
                      : "border-slate-300 focus:ring-village-600"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-[11px] text-rose-600 font-semibold">{errors.mobileNumber}</p>
                )}
              </div>

              {/* 4. Locality / Ward (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelLocality}
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="उदा. वार्ड नंबर 3, कुम्हार मोहल्ला / पूर्वी ढाणी, बुड़ीवाड़ा"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-village-600"
                />
              </div>

              {/* 5. Preferred Contact Method */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelPreferredContactMethod}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod("phone")}
                    className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      preferredContactMethod === "phone"
                        ? "bg-village-50 border-village-600 text-village-900 ring-2 ring-village-600/30"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Phone className="w-4 h-4 text-village-700" />
                    <span>{t.methodPhone}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod("whatsapp")}
                    className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      preferredContactMethod === "whatsapp"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/30"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>{t.methodWhatsapp}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredContactMethod("in_person")}
                    className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                      preferredContactMethod === "in_person"
                        ? "bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-600/30"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>{t.methodInPerson}</span>
                  </button>
                </div>
              </div>

              {/* 6. Subject or Village Problem (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  {t.labelSubjectOrProblem}
                </label>
                <textarea
                  value={subjectOrProblem}
                  onChange={(e) => setSubjectOrProblem(e.target.value)}
                  placeholder="जिस विषय या समस्या पर आप टीम से बात करना चाहते हैं, संक्षेप में लिखें..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-village-600 placeholder:text-slate-400"
                />
              </div>

              {/* 7. Mandatory Consent Checkbox */}
              <div className="pt-2">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    consentToContact
                      ? "bg-village-50 border-village-600"
                      : errors.consent
                      ? "bg-rose-50/50 border-rose-300"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={consentToContact}
                    onChange={(e) => setConsentToContact(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded text-village-700 focus:ring-village-600"
                  />
                  <span className="text-xs text-slate-800 font-medium leading-relaxed">
                    {t.labelContactConsent}
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-village-700 hover:bg-village-800 active:scale-98 text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{t.submittingText}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.btnSubmitContact}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* CONFIRMATION SCREEN */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {t.contactSuccessTitle}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t.contactSuccessMsg}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-slate-700 max-w-md mx-auto text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-village-700 shrink-0 mt-0.5" />
                <p>
                  <strong>गोपनीयता सुरक्षा:</strong> आपका संपर्क विवरण केवल समस्या समाधान के लिए सुरक्षित रखा गया है और यह कभी सार्वजनिक नहीं किया जाएगा।
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  नया संपर्क अनुरोध भेजें
                </button>

                <Link
                  href="/feedback"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-village-700 hover:bg-village-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>गाँव की समस्या दर्ज करें</span>
                </Link>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Home className="w-4 h-4" />
                  <span>मुख्य पृष्ठ</span>
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
