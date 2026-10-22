"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { getSiteContent } from "@/lib/dataService";
import { SiteContent } from "@/types";
import {
  Shield,
  HelpCircle,
  MessageSquarePlus,
  Vote,
  HeartHandshake,
} from "lucide-react";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header Badge & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-village-100 text-village-800 text-xs font-semibold border border-village-200">
              <Shield className="w-3.5 h-3.5 text-village-700" />
              <span>Janawaaz.in • सक्रिय जनमत पोल प्रत्याशी परिचय</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {content?.candidateName || t.candidateName}
            </h1>
            <p className="text-lg text-village-700 font-semibold">
              {content?.candidateCategory || t.candidateCategory} • {content?.village || t.villageName} (राजस्थान)
            </p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
              janawaaz.in राजस्थान के नागरिकों के लिए एक स्वतंत्र जनमत व जन-संवाद मंच है। वर्तमान में ग्राम पंचायत बुड़ीवाड़ा के सरपंच चुनाव का आधिकारिक जनमत सर्वेक्षण यहाँ संचालित है।
            </p>
          </div>

          {/* Main Card: Philosophy & Bio */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
              <div className="w-28 h-28 sm:w-36 sm:w-36 rounded-2xl bg-village-700 text-white flex items-center justify-center font-bold text-5xl shadow-md border-4 border-village-100 shrink-0">
                म
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900 font-hindi">
                  स्वच्छ, पारदर्शी एवं सेवाभावी नेतृत्व
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {content ? (language === "hi" ? content.bioHindi : content.bioEnglish) : t.introDescription}
                </p>
              </div>
            </div>

            {/* Vision & Pledge */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-village-700" />
                <span>हमारा मूल दृष्टिकोण (Our Vision)</span>
              </h3>
              <p className="text-slate-700 text-base leading-relaxed bg-cream-100 p-6 rounded-2xl border border-cream-300 font-medium">
                &ldquo;{content ? (language === "hi" ? content.visionHindi : content.visionEnglish) : t.introPledgeDesc}&rdquo;
              </p>
            </div>

            {/* Guiding Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">कोई दिखावटी वादे नहीं</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  हम केवल उन्हीं प्राथमिकताओं को उठाएंगे जो ग्रामवासियों की वास्तविक समस्याओं से सीधे जुड़ी हैं।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">पूर्ण निष्पक्षता (निर्दलीय)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  बिना किसी दलीय दबाव के बुड़ीवाड़ा के हर मोहल्ले, जाति और वर्ग के लिए समान रूप से समर्पित।
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">डिजिटल एवं पारदर्शी संवाद</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  इस ऑनलाइन पोर्टल के माध्यम से समस्याएँ सीधे दर्ज होंगी और उनकी प्रगति की समीक्षा की जाएगी।
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions (FAQs) */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 font-hindi flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-village-700" />
                <span>अक्सर पूछे जाने वाले प्रश्न (FAQs)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                ग्राम-संवाद पोर्टल एवं सहभागिता प्रक्रिया संबंधी सामान्य जानकारी
              </p>
            </div>

            <div className="space-y-4">
              {(content?.faqs || []).map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2"
                >
                  <h4 className="font-bold text-slate-900 text-base">
                    {language === "hi" ? faq.qHi : faq.qEn}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === "hi" ? faq.aHi : faq.aEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen CTAs */}
          <div className="bg-village-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-hindi">
              आप भी बुड़ीवाड़ा के विकास में भागीदार बनें
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto">
              अपनी समस्या या गाँव के विकास हेतु रचनात्मक सुझाव हमें तुरंत बताएं। आपकी आवाज हमारी प्राथमिकता बनेगी।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/feedback"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-village-900 hover:bg-emerald-50 font-bold text-sm shadow transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-village-700" />
                  <span>समस्या या सुझाव दर्ज करें</span>
                </span>
              </Link>
              <Link
                href="/opinion"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <Vote className="w-4 h-4 text-white" />
                  <span>गोपनीय राय-शुमारी में भाग लें</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
