"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { getPublicSurveyCount, getSiteContent } from "@/lib/dataService";
import { SiteContent } from "@/types";
import {
  Vote,
  MessageSquarePlus,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  GraduationCap,
  HeartPulse,
  PhoneCall,
  MapPin,
  Clock,
  Phone,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [publicCount, setPublicCount] = useState<number>(0);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        let count = 0;
        try {
          const res = await fetch("/api/opinion");
          if (res.ok) {
            const json = await res.json();
            count = json.publicSurveyCount ?? 0;
          } else {
            count = await getPublicSurveyCount();
          }
        } catch {
          count = await getPublicSurveyCount();
        }
        const contentData = await getSiteContent();
        setPublicCount(count);
        setContent(contentData);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-slate-900 font-hindi">
      <Navbar />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* 1. HERO SECTION: Clean Green, White & Cream Palette           */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-village-900 via-village-850 to-village-800 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            {/* Candidate category badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-village-700/90 border border-emerald-400/40 text-xs sm:text-sm text-emerald-100 font-semibold shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.candidateCategory} • {t.villageName}</span>
            </div>

            {/* Candidate Name */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {content?.candidateName || t.candidateName}
              </h1>
              <p className="text-lg sm:text-2xl text-amber-300 font-semibold">
                {language === "hi" ? "निर्दलीय सरपंच प्रत्याशी — ग्राम पंचायत बुड़ीवाड़ा" : "Independent Sarpanch Candidate — Gram Panchayat Budivada"}
              </p>
            </div>

            {/* Candidate Photograph & Welcome Note */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-white/20 shadow-xl">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg shrink-0 bg-village-950 flex items-center justify-center">
                <Image
                  src={content?.candidatePhotoUrl || "/images/candidate.svg"}
                  alt="Shri Mohan Singh Ji"
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-village-950 text-xs font-bold uppercase tracking-wider">
                  हमारा संकल्प
                </span>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-normal">
                  {content ? (language === "hi" ? content.bioHindi : content.bioEnglish) : t.heroSubheadline}
                </p>
              </div>
            </div>

            {/* TWO LARGE PROMINENT BUTTONS (Mobile-First) */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-2xl mx-auto">
              {/* Large Button 1: अपनी राय दें */}
              <Link
                href="/opinion"
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-village-950 font-extrabold text-lg sm:text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-amber-300"
              >
                <Vote className="w-7 h-7 text-village-950 shrink-0" />
                <span>{t.btnGiveOpinion}</span>
              </Link>

              {/* Large Button 2: गाँव की समस्याएँ बताएं */}
              <Link
                href="/feedback"
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white hover:bg-cream-100 text-village-900 font-extrabold text-lg sm:text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-2 border-emerald-200"
              >
                <MessageSquarePlus className="w-7 h-7 text-village-700 shrink-0" />
                <span>{t.btnReportProblem}</span>
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-emerald-100 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% गोपनीय व सुरक्षित</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>कोई लॉगिन या पासवर्ड नहीं</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>राजनीतिक राय पूरी तरह अनाम</span>
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. BASIC PUBLIC STATISTICS (STRICTLY COUNT ONLY, NO YES/NO)   */}
        {/* ============================================================== */}
        <section className="relative -mt-6 max-w-4xl mx-auto px-4 sm:px-6 z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-village-200 text-center space-y-3">
            <span className="inline-block text-xs font-bold text-village-800 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
              वास्तविक ग्रामवासी सहभागिता
            </span>

            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {loading ? (
                <span>आंकड़े लोड हो रहे हैं...</span>
              ) : (
                <span>
                  अब तक <strong className="text-village-700 text-2xl sm:text-4xl px-1.5 underline decoration-amber-400">{publicCount}</strong> लोगों ने सर्वे में अपनी राय साझा की है।
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              (यह संख्या वास्तविक सबमिट किए गए सर्वे रिकॉर्ड्स पर आधारित है। नागरिकों की व्यक्तिगत राय और हाँ/नहीं विवरण पूरी तरह गोपनीय रखा जाता है।)
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. CANDIDATE INTRODUCTION & RURAL COMMUNITY VALUES             */}
        {/* ============================================================== */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2 text-center sm:text-left border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-village-700 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
                परिचय एवं दृष्टिकोण
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t.introTitle}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {content ? (language === "hi" ? content.visionHindi : content.visionEnglish) : t.introDescription}
            </p>

            {/* Three Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">समान विकास</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  बिना किसी पक्षपात या दलगत भेदभाव के गाँव के सभी मोहल्लों और ढाणियों का समान विकास।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">खर्च में पारदर्शिता</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  पंचायत को मिलने वाले एक-एक पैसे का स्पष्ट और सार्वजनिक हिसाब ग्रामसभा के सम्मुख।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">नियमित जनसुनवाई</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  सरपंच से मिलने के लिए चक्कर न काटने पड़ें, नियमित बैठकों में शिकायतों का त्वरित निवारण।
                </p>
              </div>
            </div>

            <div className="pt-2 text-center sm:text-left">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-village-800 hover:text-village-950 hover:underline"
              >
                <span>श्री मोहन सिंह जी का विस्तृत संकल्प पत्र पढ़ें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. PRIMARY VILLAGE PRIORITIES                                 */}
        {/* ============================================================== */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-bold text-village-700 uppercase tracking-wider bg-village-50 px-3 py-1 rounded-full border border-village-200">
              गाँव की मुख्य आवश्यकताएँ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              गाँव के विकास के प्रमुख प्राथमिकता क्षेत्र
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              ग्रामवासियों की बुनियादी समस्याओं के स्थायी समाधान हेतु चिन्हित प्राथमिकताएं
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">पीने का स्वच्छ पानी</h3>
              <p className="text-xs text-slate-500">घर-घर जल आपूर्ति व लीकेज मरम्मत</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">पक्की सड़कें व मरम्मत</h3>
              <p className="text-xs text-slate-500">स्कूल व मुख्य मार्गों का सुदृढ़ीकरण</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">नाली व जल निकासी</h3>
              <p className="text-xs text-slate-500">ढकी हुई पक्की नालियों का निर्माण</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">स्ट्रीट लाइट व्यवस्था</h3>
              <p className="text-xs text-slate-500">मुख्य मार्गों व चौराहों पर प्रकाश</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">शिक्षा व विद्यालय सुधार</h3>
              <p className="text-xs text-slate-500">स्वच्छ शौचालय, पानी व पुस्तकालय</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">स्वास्थ्य सुविधाएँ</h3>
              <p className="text-xs text-slate-500">दवाइयों की उपलब्धता व नियमित जांच</p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. SEPARATE PERSONAL CONTACT REQUEST SECTION                   */}
        {/* ============================================================== */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-village-800 to-village-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-village-700 text-emerald-200 text-xs font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>व्यक्तिगत संवाद एवं स्थल निरीक्षण</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  क्या आप चाहते हैं कि प्रत्याशी की टीम आपसे व्यक्तिगत संपर्क करे?
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                  यदि आपकी कोई विशेष समस्या या सुझाव है जिस पर आप चर्चा करना चाहते हैं, तो अलग से संपर्क फॉर्म भरें। यह राजनीतिक राय से पूरी तरह अलग रहता है।
                </p>
              </div>

              <Link
                href="/contact"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-village-950 font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105"
              >
                <span>संपर्क अनुरोध दर्ज करें</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. CONTACT INFORMATION & OFFICE HOURS                         */}
        {/* ============================================================== */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">कार्यालय पता</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content?.contact.addressHi || t.officeAddress}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">जन-सुनवाई समय</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content?.contact.visitingHoursHi || t.visitingHours}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-village-100 text-village-800 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">हेल्पलाइन एवं संवाद</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content?.contact.phone || t.helplinePhone}
                <br />
                <span className="text-[11px] text-slate-500">{content?.contact.email || "contact@budivada.in"}</span>
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. PRIVACY NOTICE BANNER                                      */}
        {/* ============================================================== */}
        <section className="py-6 px-4 sm:px-6 max-w-5xl mx-auto mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-950">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>गोपनीयता एवं सुरक्षा गारंटी:</strong> इस वेबसाइट पर सर्वे पूरी तरह गोपनीय और अनाम है। किसी भी व्यक्ति का नाम या फोन नंबर उनके वोट संबंधी विचार से कभी नहीं जोड़ा जाता।
              </div>
            </div>
            <Link
              href="/privacy"
              className="shrink-0 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs whitespace-nowrap"
            >
              गोपनीयता नीति पढ़ें
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
