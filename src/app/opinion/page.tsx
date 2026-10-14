"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { submitAnonymousOpinion, getAggregateStats } from "@/lib/dataService";
import { AggregateStats, OpinionOption } from "@/types";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function OpinionPage() {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<OpinionOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState<AggregateStats | null>(null);

  useEffect(() => {
    // Check if resident already submitted opinion in this browser session
    const alreadyVoted = localStorage.getItem("budivada_voted_opinion_session");
    if (alreadyVoted) {
      setSubmitted(true);
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getAggregateStats();
    setStats(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    setSubmitting(true);
    try {
      await submitAnonymousOpinion(selectedOption);
      localStorage.setItem("budivada_voted_opinion_session", "true");
      setSubmitted(true);
      await loadStats();
    } catch (err) {
      console.error("Opinion submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200">
              <Vote className="w-3.5 h-3.5 text-amber-700" />
              <span>स्वैच्छिक एवं गोपनीय जनमत</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {t.opinionTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              {t.opinionSubtitle}
            </p>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 flex items-start gap-3.5 text-xs sm:text-sm text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-950">पूर्ण गोपनीयता की गारंटी:</h4>
              <p className="text-emerald-800 leading-relaxed text-xs">
                यह प्रक्रिया 100% अनाम है। हम कोई नाम, मोबाइल नंबर, जीपीएस लोकेशन या डिवाइस आईडी दर्ज नहीं करते। प्रशासन को केवल कुल संख्या और प्रतिशत अनुपात दिखाई देता है।
              </p>
            </div>
          </div>

          {/* OPINION POLL FORM */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="space-y-3 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  गोपनीय प्रश्न:
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-hindi">
                  {t.opinionQuestion}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOption === "support"
                      ? "bg-village-50 border-village-600 ring-2 ring-village-600 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="opinion"
                    value="support"
                    checked={selectedOption === "support"}
                    onChange={() => setSelectedOption("support")}
                    className="mt-1 text-village-700 focus:ring-village-600 h-4 w-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base block">
                      {t.opinionOptSupport}
                    </span>
                    <span className="text-xs text-slate-500">
                      श्री मोहन सिंह जी के विकास दृष्टिकोण का समर्थन
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOption === "undecided"
                      ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="opinion"
                    value="undecided"
                    checked={selectedOption === "undecided"}
                    onChange={() => setSelectedOption("undecided")}
                    className="mt-1 text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base block">
                      {t.opinionOptUndecided}
                    </span>
                    <span className="text-xs text-slate-500">
                      कार्ययोजना व उम्मीदवारों की तुलना के बाद निर्णय लेंगे
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOption === "other"
                      ? "bg-slate-100 border-slate-400 ring-2 ring-slate-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="opinion"
                    value="other"
                    checked={selectedOption === "other"}
                    onChange={() => setSelectedOption("other")}
                    className="mt-1 text-slate-700 focus:ring-slate-500 h-4 w-4"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm sm:text-base block">
                      {t.opinionOptOther}
                    </span>
                    <span className="text-xs text-slate-500">
                      अन्य विकल्प या निर्दलीय प्रत्याशी पर विचार
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedOption || submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>दर्ज किया जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Vote className="w-5 h-5" />
                      <span>{t.btnSubmitOpinion}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* RESULTS & ACKNOWLEDGEMENT SCREEN */
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="text-center space-y-3 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-hindi">
                  {t.opinionSubmittedMsg}
                </h3>
                <p className="text-xs text-slate-500">
                  आपकी राय संकलित आंकड़ों में सुरक्षित रूप से जोड़ दी गई है।
                </p>
              </div>

              {/* Aggregated Results Bars */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t.opinionLiveResultsTitle}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {t.opinionTotalVotes}: {stats?.opinionStats.total ?? 0}
                  </span>
                </div>

                {/* Option 1: Support */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{t.opinionOptSupport}</span>
                    <span className="text-village-800 font-bold">{stats?.opinionStats.supportPercent ?? 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-village-700 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${stats?.opinionStats.supportPercent ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Option 2: Undecided */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{t.opinionOptUndecided}</span>
                    <span className="text-amber-700 font-bold">{stats?.opinionStats.undecidedPercent ?? 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${stats?.opinionStats.undecidedPercent ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Option 3: Other */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{t.opinionOptOther}</span>
                    <span className="text-slate-700 font-bold">{stats?.opinionStats.otherPercent ?? 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-slate-400 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${stats?.opinionStats.otherPercent ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-village-700 hover:bg-village-800 text-white font-semibold text-xs shadow"
                >
                  <span>गाँव की समस्या या सुझाव भी साझा करें</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Mandatory Democratic Legal Disclaimer */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>महत्वपूर्ण संवैधानिक एवं कानूनी स्पष्टीकरण:</span>
            </div>
            <p className="leading-relaxed">
              {t.opinionDisclaimer}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
