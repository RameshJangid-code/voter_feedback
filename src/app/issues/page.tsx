"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAggregateStats, getAllFeedback } from "@/lib/dataService";
import { AggregateStats, PublicFeedback, ProblemCategory } from "@/types";
import {
  BarChart3,
  Shield,
  MessageSquarePlus,
  Clock,
  Lightbulb,
  Search,
} from "lucide-react";

export default function IssuesPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [feedbackList, setFeedbackList] = useState<PublicFeedback[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, feedbackData] = await Promise.all([
          getAggregateStats(),
          getAllFeedback(false), // only approved, public
        ]);
        setStats(statsData);
        setFeedbackList(feedbackData);
      } catch (err) {
        console.error("Failed to load issues:", err);
      }
    }
    loadData();
  }, []);

  const categories: { key: string; label: string }[] = [
    { key: "all", label: t.filterAll },
    { key: "water", label: t.catWater },
    { key: "roads", label: t.catRoads },
    { key: "drainage", label: t.catDrainage },
    { key: "streetlights", label: t.catStreetlights },
    { key: "education", label: t.catEducation },
    { key: "health", label: t.catHealth },
    { key: "employment", label: t.catEmployment },
    { key: "govSchemes", label: t.catGovSchemes },
    { key: "cleanliness", label: t.catCleanliness },
    { key: "other", label: t.catOther },
  ];

  const filteredItems = feedbackList.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedImprovement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ward && item.ward.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categoryEntries = stats
    ? (Object.entries(stats.categoryCounts) as [ProblemCategory, number][]).sort(
        (a, b) => b[1] - a[1]
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-village-100 text-village-800 text-xs font-semibold border border-village-200">
              <BarChart3 className="w-3.5 h-3.5 text-village-700" />
              <span>पारदर्शी जन-आंकड़े एवं प्राथमिकताएं</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {t.issuesTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              {t.issuesSubtitle}
            </p>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>गोपनीयता सुरक्षा:</strong> नीचे केवल जन-समस्याओं के संकलित आंकड़े और अनाम सुझाव प्रदर्शित हैं। किसी नागरिक की पहचान प्रकाशित नहीं की जाती।
              </span>
            </div>
            <Link
              href="/privacy"
              className="text-village-700 hover:underline font-semibold shrink-0"
            >
              नीति देखें
            </Link>
          </div>

          {/* Aggregate Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                कुल दर्ज समस्याएँ
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats?.totalFeedback ?? 0}
              </div>
              <div className="text-xs text-slate-400">विभिन्न वार्डों से संकलित</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                अति आवश्यक मुद्दे
              </div>
              <div className="text-3xl font-extrabold text-rose-700">
                {stats?.highPriorityCount ?? 0}
              </div>
              <div className="text-xs text-slate-400">उच्च प्राथमिकता श्रेणी</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                कार्ययोजना में शामिल
              </div>
              <div className="text-3xl font-extrabold text-indigo-700">
                {stats?.addressedCount ? stats.addressedCount + (stats.resolvedCount || 0) : 0}
              </div>
              <div className="text-xs text-slate-400">समीक्षित एवं दर्ज</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                सुलझाए गए मुद्दे
              </div>
              <div className="text-3xl font-extrabold text-emerald-700">
                {stats?.resolvedCount ?? 0}
              </div>
              <div className="text-xs text-slate-400">प्राथमिक रूप से निराकृत</div>
            </div>
          </div>

          {/* Category Distribution Chart / Visual Bars */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-hindi">
                  समस्याओं का श्रेणीवार वितरण (Category Distribution)
                </h3>
                <p className="text-xs text-slate-500">
                  ग्रामवासियों द्वारा सबसे अधिक किस विषय पर समस्याएँ दर्ज कराई गईं
                </p>
              </div>
              <span className="text-xs bg-village-50 text-village-800 font-semibold px-2.5 py-1 rounded-full border border-village-200 self-start sm:self-auto">
                वास्तविक संकलन
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryEntries.map(([catKey, count]) => {
                const total = stats?.totalFeedback || 1;
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={catKey} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <CategoryBadge category={catKey} />
                      <span className="font-bold text-slate-700">
                        {count} मुद्दे ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-village-700 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FILTER & FEEDBACK LISTING */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-hindi">
                  {t.recentSuggestionsTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  प्रशासनिक टीम द्वारा समीक्षित जन-समस्याएं एवं सुझाव
                </p>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="खोजें (वार्ड, समस्या, सुझाव)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-village-600 outline-none"
                />
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.key
                      ? "bg-village-700 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List of Feedback items */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Lightbulb className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-slate-600 text-sm">{t.noSuggestionsFound}</p>
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-village-700 hover:underline"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>इस विषय पर पहली समस्या दर्ज करें</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.feedbackId}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CategoryBadge category={item.category} />
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={item.priority} />
                          <StatusBadge status={item.status} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          समस्या विवरण {item.ward ? `• ${item.ward}` : ""}:
                        </h4>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>

                      {item.suggestedImprovement && (
                        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-village-800 block">अपेक्षित सुधार:</span>
                          <p>{item.suggestedImprovement}</p>
                        </div>
                      )}

                      {item.villageDevelopmentSuggestion && (
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-amber-900 block">गाँव विकास हेतु सुझाव:</span>
                          <p>{item.villageDevelopmentSuggestion}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(item.createdAt).toLocaleDateString("hi-IN")}</span>
                      </span>
                      <span className="text-emerald-700 font-semibold">अनाम जन-प्रविष्टि</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
