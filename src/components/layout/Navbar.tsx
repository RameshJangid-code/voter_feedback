"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  Menu,
  X,
  Languages,
  Shield,
  MessageSquarePlus,
  Home,
  User,
  Vote,
  BarChart3,
  Lock,
} from "lucide-react";

export function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.navHome, icon: <Home className="w-4 h-4" /> },
    { href: "/about", label: t.navAbout, icon: <User className="w-4 h-4" /> },
    { href: "/feedback", label: t.navFeedback, icon: <MessageSquarePlus className="w-4 h-4" /> },
    { href: "/issues", label: t.navIssues, icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/opinion", label: t.navOpinion, icon: <Vote className="w-4 h-4" /> },
    { href: "/privacy", label: t.navPrivacy, icon: <Shield className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top micro banner for rural trust & candidate identification */}
      <div className="bg-village-800 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">
              {language === "hi"
                ? "ग्राम पंचायत बुड़ीवाड़ा — निष्पक्ष, पारदर्शी एवं जन-सहभागिता मंच"
                : "Gram Panchayat Budivada — Transparent Community Feedback Portal"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-village-200 hover:text-white flex items-center gap-1 text-[11px] underline-offset-2 hover:underline"
            >
              <Lock className="w-3 h-3" />
              <span>{t.navAdmin}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Candidate Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-village-800 transition-colors border border-village-600">
              म
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-village-800 transition-colors">
                  {t.candidateName}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-village-100 text-village-800 border border-village-200">
                  {t.candidateCategory}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span>{t.villageName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-village-700 font-semibold">जन-संवाद पोर्टल</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? "bg-village-50 text-village-800 font-bold border border-village-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action buttons (Language Switch & CTA) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
              title="Switch Language"
            >
              <Languages className="w-4 h-4 text-village-700" />
              <span>{language === "hi" ? "English" : "हिन्दी"}</span>
            </button>

            {/* CTA Button */}
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-village-700 hover:bg-village-800 text-white text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{t.btnReportProblem}</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              type="button"
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1"
            >
              <Languages className="w-3.5 h-3.5 text-village-700" />
              <span>{language === "hi" ? "EN" : "हिन्दी"}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2">
          <div className="px-2 py-1 mb-2 bg-village-50 rounded-lg border border-village-200">
            <p className="text-xs font-semibold text-village-900">{t.candidateName}</p>
            <p className="text-[11px] text-village-700">{t.candidateCategory} • {t.villageName}</p>
          </div>

          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                  active
                    ? "bg-village-100 text-village-900 font-bold border border-village-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className={active ? "text-village-700" : "text-slate-500"}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-village-700 text-white font-semibold shadow text-center"
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>{t.btnReportProblem}</span>
            </Link>

            <Link
              href="/opinion"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow text-center text-sm"
            >
              <Vote className="w-4 h-4" />
              <span>{t.btnOpinionPoll}</span>
            </Link>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.navAdmin}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
