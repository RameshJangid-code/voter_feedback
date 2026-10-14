"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Shield,
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Lock,
  MessageSquarePlus,
  Vote,
  BarChart3,
} from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Candidate identity & ethics */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold text-lg shadow">
                म
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{t.candidateName}</h3>
                <p className="text-xs text-village-400 font-medium">{t.candidateCategory}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.footerAboutText}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-emerald-400 border border-slate-700">
                <Shield className="w-3.5 h-3.5" />
                <span>100% निष्पक्ष • ग्राम-हित सर्वोपरि</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-village-500 pl-2">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>›</span>
                  <span>{t.navHome}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>›</span>
                  <span>{t.navAbout}</span>
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors flex items-center gap-2 text-village-400 font-medium">
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>{t.navFeedback}</span>
                </Link>
              </li>
              <li>
                <Link href="/issues" className="hover:text-white transition-colors flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{t.navIssues}</span>
                </Link>
              </li>
              <li>
                <Link href="/opinion" className="hover:text-white transition-colors flex items-center gap-2 text-amber-400 font-medium">
                  <Vote className="w-3.5 h-3.5" />
                  <span>{t.navOpinion}</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.navPrivacy}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Visiting Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-village-500 pl-2">
              {t.contactTitle}
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-village-400 mt-1 shrink-0" />
                <span className="leading-snug">{t.officeAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-village-400 mt-1 shrink-0" />
                <span className="leading-snug">{t.visitingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-village-400 shrink-0" />
                <span>{t.helplinePhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-village-400 shrink-0" />
                <span>contact@budivada-sarpanch.in</span>
              </div>
            </div>
          </div>

          {/* Col 4: Privacy & Democratic Assurance */}
          <div className="space-y-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>गोपनीयता एवं सुरक्षा भरोसा</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.privacyNoticeSummary}
            </p>
            <div className="pt-2 text-xs text-slate-400 border-t border-slate-700">
              <p>यह मंच स्वतंत्र विकास विमर्श के लिए है। किसी भी मतदाता की प्राथमिकताओं का राजनीतिक दुरुपयोग वर्जित है।</p>
            </div>
            <div className="pt-1">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Lock className="w-3 h-3 text-village-400" />
                <span>प्रशासनिक लॉगिन पोर्टल</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t.copyrightText}</p>
          <p className="flex items-center gap-1">
            <span>बुड़ीवाड़ा ग्रामवासियों के सशक्तिकरण हेतु समर्पित</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
