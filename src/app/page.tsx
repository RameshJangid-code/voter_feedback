"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAggregateStats, getAllFeedback, getSiteContent } from "@/lib/dataService";
import { AggregateStats, PublicFeedback, SiteContent } from "@/types";
import {
  MessageSquarePlus,
  Vote,
  Sparkles,
  ArrowRight,
  Shield,
  Droplets,
  Milestone,
  GraduationCap,
  HeartPulse,
  Trash2,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [recentIssues, setRecentIssues] = useState<PublicFeedback[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, feedbackData, contentData] = await Promise.all([
          getAggregateStats(),
          getAllFeedback(false),
          getSiteContent(),
        ]);
        setStats(statsData);
        setRecentIssues(feedbackData.slice(0, 4));
        setContent(contentData);
      } catch (err) {
        console.error("Error loading home page data:", err);
      }
    }
    loadData();
  }, []);

  const getPriorityIcon = (iconName: string) => {
    switch (iconName) {
      case "Droplets":
        return <Droplets className="w-6 h-6 text-blue-600" />;
      case "Road":
        return <Milestone className="w-6 h-6 text-amber-700" />;
      case "Activity":
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-indigo-600" />;
      case "Trash2":
        return <Trash2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <Shield className="w-6 h-6 text-village-700" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Urgent Announcement Banner if available */}
        {content?.announcements && content.announcements.length > 0 && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-semibold shadow-inner border-b border-amber-600">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="bg-slate-950 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider shrink-0">
                  सूचना
                </span>
                <span className="truncate">
                  {language === "hi"
                    ? content.announcements[0].titleHi + ": " + content.announcements[0].contentHi
                    : content.announcements[0].titleEn + ": " + content.announcements[0].contentEn}
                </span>
              </div>
              <Link
                href="/about"
                className="text-xs underline shrink-0 hover:text-white transition-colors"
              >
                {language === "hi" ? "विवरण देखें" : "View"}
              </Link>
            </div>
          </div>
        )}

        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-village-900 via-village-800 to-village-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          {/* Subtle rural background decorative shapes */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-8">
            {/* Candidate category badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-village-700/80 border border-village-500/60 text-xs sm:text-sm text-emerald-100 font-semibold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t.heroBadge}</span>
            </div>

            {/* Candidate Name & Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-hindi">
                {content?.candidateName || t.candidateName}
              </h1>
              <p className="text-xl sm:text-2xl text-emerald-200 font-semibold">
                {t.heroHeadline}
              </p>
            </div>

            {/* Sub-headline / Candidate mandate */}
            <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed font-normal">
              {content ? (language === "hi" ? content.bioHindi : content.bioEnglish) : t.heroSubheadline}
            </p>

            {/* Prominent Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <Link
                href="/feedback"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-village-900 hover:bg-emerald-50 font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageSquarePlus className="w-5 h-5 text-village-700" />
                <span>{t.btnReportProblem}</span>
              </Link>

              <Link
                href="/feedback"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-village-700/70 hover:bg-village-700 border border-emerald-400/40 text-white font-semibold text-base shadow-lg hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.btnShareExpectations}</span>
              </Link>

              <Link
                href="/opinion"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base shadow-lg hover:scale-[1.02] transition-all"
              >
                <Vote className="w-5 h-5 text-amber-100" />
                <span>{t.btnOpinionPoll}</span>
              </Link>
            </div>

            {/* Micro Trust Guarantee */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% निजता सुरक्षा</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>स्वैच्छिक सहभागिता</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>निष्पक्ष जन-भागीदारी</span>
              </span>
            </div>
          </div>
        </section>

        {/* 2. LIVE ANONYMOUS COMMUNITY METRICS (SUMMARY STATS) */}
        <section className="relative -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-2xl sm:text-4xl font-extrabold text-village-800">
                {stats?.totalFeedback ?? "14+"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.statFeedbackCount}
              </div>
              <div className="text-[11px] text-slate-500">वार्डों से प्राप्त फीडबैक</div>
            </div>

            <div className="space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-2xl sm:text-4xl font-extrabold text-indigo-700">
                {stats?.addressedCount ? stats.addressedCount + (stats.resolvedCount || 0) : "8"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.statAddressedCount}
              </div>
              <div className="text-[11px] text-slate-500">प्राथमिकता में शामिल</div>
            </div>

            <div className="space-y-1 border-r border-slate-100 last:border-none">
              <div className="text-2xl sm:text-4xl font-extrabold text-rose-600">
                {stats?.highPriorityCount ?? "6"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">
                अति आवश्यक मुद्दे
              </div>
              <div className="text-[11px] text-slate-500">तत्काल समाधान योग्य</div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-600">
                {stats?.opinionStats.total ?? "14"}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">
                गोपनीय जनमत राय
              </div>
              <div className="text-[11px] text-slate-500">पूर्णतः अनाम सहभागिता</div>
            </div>
          </div>
        </section>

        {/* 3. CANDIDATE INTRODUCTION & COMMUNITY PLEDGE */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-cream-100 rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-village-100 text-village-800 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5 text-village-700" />
                  <span>प्रत्याशी दृष्टिकोण एवं परिचय</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-hindi">
                  {content ? (language === "hi" ? "श्री मोहन सिंह जी का संकल्प" : "Shri Mohan Singh Ji's Vision") : t.introTitle}
                </h2>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {content ? (language === "hi" ? content.visionHindi : content.visionEnglish) : t.introDescription}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-4 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-village-700 shrink-0 mt-0.5" />
                    <span><strong>कोई झूठे वादे नहीं:</strong> कार्ययोजना ग्रामीणों की दर्ज समस्याओं के आधार पर ही बनेगी।</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-village-700 shrink-0 mt-0.5" />
                    <span><strong>निष्पक्षता:</strong> किसी भी दलगत पूर्वाग्रह के बिना सभी वार्डों का समान विकास।</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-village-700 text-white flex items-center justify-center text-3xl font-bold shadow">
                  म
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{t.candidateName}</h3>
                  <p className="text-xs text-village-700 font-semibold">{t.candidateCategory}</p>
                  <p className="text-xs text-slate-500">{t.villageName}</p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-village-800 hover:text-village-900 hover:underline"
                  >
                    <span>विस्तार से परिचय पढ़ें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRIMARY ISSUES / DEVELOPMENT PRIORITIES */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-village-700 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
              गाँव की बुनियादी जरूरतें
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-hindi">
              {t.primaryIssuesTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t.primaryIssuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(content?.priorities || []).map((priority) => (
              <div
                key={priority.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-village-300 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-village-50 border border-village-100 flex items-center justify-center group-hover:bg-village-100 transition-colors">
                  {getPriorityIcon(priority.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-village-800 transition-colors">
                  {language === "hi" ? priority.titleHi : priority.titleEn}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "hi" ? priority.descHi : priority.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow transition-all"
            >
              <span>{t.viewAllIssues}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 5. RECENT MODERATED PUBLIC FEEDBACK */}
        <section className="py-16 bg-slate-100 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-village-700 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
                  पारदर्शी जन-सुनवाई
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-hindi">
                  ग्रामवासियों द्वारा दर्ज हालिया समस्याएँ व सुझाव
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  गोपनीयता के साथ संकलित वास्तविक ग्राम समस्याएँ (व्यक्तिगत पहचान पूरी तरह सुरक्षित)
                </p>
              </div>
              <Link
                href="/feedback"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-village-700 hover:bg-village-800 text-white text-sm font-semibold shrink-0"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>अपनी समस्या जोड़ें</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentIssues.map((issue) => (
                <div
                  key={issue.feedbackId}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CategoryBadge category={issue.category} />
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={issue.priority} />
                      <StatusBadge status={issue.status} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      समस्या विवरण {issue.ward ? `(${issue.ward})` : ""}:
                    </h4>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {issue.suggestedImprovement && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-village-800 block">ग्रामवासी का समाधान सुझाव:</span>
                      <p>{issue.suggestedImprovement}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(issue.createdAt).toLocaleDateString("hi-IN")}</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">अनाम सत्यापित प्रविष्टि</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/issues"
                className="inline-flex items-center gap-2 text-sm font-semibold text-village-800 hover:text-village-900 hover:underline"
              >
                <span>सभी संकलित समस्याएं व चार्ट देखें</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION: VOLUNTARY ANONYMOUS OPINION POLL */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/80 text-white text-xs font-bold uppercase tracking-wider">
              <Vote className="w-4 h-4" />
              <span>स्वैच्छिक एवं 100% गोपनीय राय-शुमारी</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-hindi">
              आपकी वर्तमान राय क्या है?
            </h2>

            <p className="max-w-2xl mx-auto text-amber-100 text-sm sm:text-base leading-relaxed">
              बुड़ीवाड़ा के भविष्य के लिए आपकी राय अनमोल है। बिना किसी नाम, नंबर या पहचान के स्वेच्छा से अपनी राय दर्ज करें और संकलित रुझान देखें।
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/opinion"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 font-bold text-base shadow-lg transition-transform hover:scale-105"
              >
                <span>गोपनीय राय दर्ज करें</span>
              </Link>
              <Link
                href="/privacy"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-800/80 hover:bg-amber-800 text-white font-medium text-sm border border-amber-500/40"
              >
                <span>गोपनीयता नीति पढ़ें</span>
              </Link>
            </div>

            <p className="text-[11px] text-amber-200/90 max-w-xl mx-auto">
              {t.opinionDisclaimer}
            </p>
          </div>
        </section>

        {/* 7. CONTACT & CITIZEN SESSIONS INFORMATION */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">कार्यालय / संपर्क केंद्र</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.contact.addressHi || t.officeAddress}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">जन-सुनवाई समय</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.contact.visitingHoursHi || t.visitingHours}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">हेल्पलाइन एवं संवाद</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.contact.phone || t.helplinePhone}
                <br />
                <span className="text-xs text-slate-500">{content?.contact.email || "contact@budivada-sarpanch.in"}</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
