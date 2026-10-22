"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  UserCheck,
  ArrowRight,
} from "lucide-react";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-village-100 text-village-800 text-xs font-semibold border border-village-200">
              <ShieldCheck className="w-3.5 h-3.5 text-village-700" />
              <span>डेटा सुरक्षा एवं निजता संरक्षण नीति</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {t.navPrivacy} (Privacy Policy)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              janawaaz.in (बुड़ीवाड़ा जन-संवाद पोर्टल) पर आपके अधिकारों और डेटा की सुरक्षा संबंधी पारदर्शी जानकारी
            </p>
          </div>

          {/* Privacy Principles Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 font-hindi">
                <Lock className="w-5 h-5 text-village-700" />
                <span>1. राजनीतिक राय की पूर्ण गोपनीयता (Complete Political Anonymity)</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                पोर्टल के &ldquo;राय-शुमारी (Opinion Poll)&rdquo; अनुभाग में दर्ज की जाने वाली कोई भी राय 100% गोपनीय और अनाम होती है।
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
                <li>हम किसी भी मतदाता का नाम, फोन नंबर या व्यक्तिगत पहचान दर्ज नहीं करते।</li>
                <li>हम कोई आईपी पता (IP Address), जीपीएस लोकेशन या विशिष्ट डिवाइस ट्रैकर संकलित नहीं करते।</li>
                <li>प्रशासनिक टीम को केवल कुल संकलित आंकड़े (Aggregate Statistics) और प्रतिशत अनुपात ही दिखाई देते हैं।</li>
                <li>किसी भी व्यक्ति-वार समर्थक या गैर-समर्थक की सूची बनाना पूर्णतः प्रतिबंधित है।</li>
              </ul>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 font-hindi">
                <Database className="w-5 h-5 text-village-700" />
                <span>2. संपर्क विवरण का सख्त पृथक्करण (Strict Segregation of Contact Info)</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                यदि कोई ग्रामवासी किसी समस्या (जैसे पेयजल, टूटी सड़क, नाली आदि) के स्थल निरीक्षण या समाधान हेतु स्वेच्छा से अपना नाम या फोन नंबर दर्ज करता है:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
                <li>यह संपर्क जानकारी एक पूरी तरह अलग डेटाबेस संग्रह (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">followup_requests</code>) में संग्रहीत की जाती है।</li>
                <li>संपर्क डेटा को कभी भी राय-शुमारी (Opinion Poll) से नहीं जोड़ा जाता और न ही राजनीतिक प्रोफाइलिंग में इस्तेमाल किया जाता है।</li>
                <li>संपर्क विवरण केवल और केवल स्पष्ट सहमति (Explicit Consent Checkbox) मिलने पर ही लिया जाता है।</li>
              </ul>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 font-hindi">
                <EyeOff className="w-5 h-5 text-village-700" />
                <span>3. सार्वजनिक डैशबोर्ड पर क्या प्रदर्शित होता है?</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                पब्लिक डैशबोर्ड (<Link href="/issues" className="text-village-700 underline font-medium">/issues</Link>) पर केवल पारदर्शी, संकलित और अनाम जानकारी ही प्रदर्शित होती है:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
                <li>समस्याओं की कुल संख्या और उनकी विषयवार श्रेणियां (जैसे सड़क, पानी, सफाई)।</li>
                <li>समीक्षा के उपरांत रचनात्मक ग्राम-विकास सुझाव (बिना किसी व्यक्ति के नाम या फोन के)।</li>
                <li>किसी भी परिस्थिति में किसी व्यक्ति की निजी पहचान या फोन नंबर सार्वजनिक पृष्ठ पर नहीं दिखाया जाता।</li>
              </ul>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 font-hindi">
                <UserCheck className="w-5 h-5 text-village-700" />
                <span>4. डेटा का उपयोग एवं अधिकार</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                इस पोर्टल का एकमात्र उद्देश्य ग्राम पंचायत बुड़ीवाड़ा के विकास हेतु जनता की प्राथमिकताओं को समझना है। एकत्रित डेटा का किसी वाणिज्यिक (Commercial) एजेंसी, विज्ञापनकर्ता या तीसरे पक्ष को विक्रय अथवा हस्तांतरण नहीं किया जाता।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <span className="font-bold block text-amber-900">संवैधानिक एवं कानूनी सूचना:</span>
              <p className="leading-relaxed">
                यह पोर्टल एक स्वतंत्र जन-संवाद माध्यम है। यहाँ प्रस्तुत स्वैच्छिक राय-शुमारी किसी आधिकारिक चुनाव आयोग के मतदान का विकल्प नहीं है और न ही यह चुनावी परिणाम की भविष्यवाणी करती है। प्रत्येक नागरिक का मत संविधान प्रदत्त अधिकार है।
              </p>
            </div>
          </div>

          {/* Quick Return CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-village-700 hover:bg-village-800 text-white font-semibold text-sm shadow transition-all"
            >
              <span>गाँव की समस्या दर्ज करें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm transition-all"
            >
              <span>मुख्य पृष्ठ पर वापस जाएं</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
