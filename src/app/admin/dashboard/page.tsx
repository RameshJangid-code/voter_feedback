"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { getAggregateStats, getAllFeedback, generateSurveyAggregateCSV, generateFeedbackCSV } from "@/lib/dataService";
import { AggregateStats, PublicFeedback } from "@/types";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  MessageSquareCheck,
  Vote,
  Download,
  Search,
  Check,
  XCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [allFeedbackList, setAllFeedbackList] = useState<PublicFeedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [sData, fData] = await Promise.all([
          getAggregateStats(),
          getAllFeedback(true),
        ]);
        setStats(sData);
        setAllFeedbackList(fData);
      } catch (e) {
        console.error("Dashboard data load failed:", e);
      }
    }
    load();
  }, []);

  const handleExportSurveyCSV = () => {
    if (!stats) return;
    const csvContent = generateSurveyAggregateCSV(stats);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `janawaaz_survey_aggregate_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFeedbackCSV = () => {
    const csvContent = generateFeedbackCSV(allFeedbackList);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `janawaaz_feedback_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryChartData = stats
    ? [
        { name: "पेयजल", count: stats.categoryCounts.water },
        { name: "सड़क", count: stats.categoryCounts.roads },
        { name: "नाली", count: stats.categoryCounts.drainage },
        { name: "लाइट", count: stats.categoryCounts.streetlights },
        { name: "शिक्षा", count: stats.categoryCounts.education },
        { name: "स्वास्थ्य", count: stats.categoryCounts.health },
        { name: "रोजगार", count: stats.categoryCounts.employment },
        { name: "योजनाएं", count: stats.categoryCounts.govSchemes },
        { name: "सफाई", count: stats.categoryCounts.cleanliness },
        { name: "अन्य", count: stats.categoryCounts.other },
      ].filter((item) => item.count > 0)
    : [];

  const statusPieData = stats
    ? [
        { name: "लंबित (Pending)", value: stats.pendingCount, color: "#f59e0b" },
        { name: "समीक्षाधीन (Under Review)", value: stats.underReviewCount, color: "#3b82f6" },
        { name: "दर्ज (Addressed)", value: stats.addressedCount, color: "#6366f1" },
        { name: "निराकृत (Resolved)", value: stats.resolvedCount, color: "#10b981" },
      ].filter((item) => item.value > 0)
    : [];

  const filteredFeedback = allFeedbackList.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedImprovement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ward?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-hindi">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  सत्यापित प्रशासनिक विश्लेषण डैशबोर्ड
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                janawaaz.in — बुड़ीवाड़ा जन-संवाद डैशबोर्ड
              </h1>
              <p className="text-xs text-slate-400">
                ग्रामवासियों की प्रतिक्रिया, प्राथमिकताओं एवं गोपनीय सर्वे का वास्तविक सांख्यिकीय विश्लेषण
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportSurveyCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>सर्वे सांख्यिकी CSV</span>
              </button>

              <button
                onClick={handleExportFeedbackCSV}
                className="px-3.5 py-2 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>समस्याएं CSV</span>
              </button>

              <Link
                href="/admin/contacts"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>संपर्क अनुरोध सूची</span>
              </Link>
            </div>
          </div>

          {/* Privacy Segregation & Ethical Notice */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3.5 text-xs text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-300 font-bold block">
                प्रशासनिक गोपनीयता आचार संहिता (Privacy & Segregation):
              </strong>
              <p className="leading-relaxed">
                यह डैशबोर्ड केवल <strong>समग्र (Aggregate) सांख्यिकी</strong> प्रदर्शित करता है। किसी भी स्थिति में किसी नागरिक का नाम, पिता का नाम या मोबाइल नंबर उनके हाँ/नहीं (YES/NO) वोट विकल्प से नहीं मिलाया जा सकता। स्वैच्छिक संपर्क अनुरोध पृथक पृष्ठ पर प्रबंधित किए जाते हैं।
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: DETAILED SURVEY METRICS (YES / NO / TOTAL)           */}
          {/* ============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-amber-400" />
                <span>सर्वे परिणाम सारांश (Survey Results Aggregate)</span>
              </h2>
              <span className="text-xs text-slate-400">
                वास्तविक प्रविष्टियाँ: <strong className="text-white">{stats?.surveyStats.realSurveysCount ?? 0}</strong> • डेमो परीक्षण: <strong className="text-slate-400">{stats?.surveyStats.demoSurveysCount ?? 0}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Surveys */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>कुल सर्वे प्रविष्टियाँ</span>
                  <Vote className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.surveyStats.totalSurveys ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  वास्तविक ग्रामवासी उत्तर: <strong className="text-emerald-400">{stats?.surveyStats.realSurveysCount ?? 0}</strong>
                </div>
              </div>

              {/* Card 2: YES Count & % */}
              <div className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
                  <span>हाँ (YES) — समर्थन विचार</span>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 flex items-baseline gap-2">
                  <span>{stats?.surveyStats.yesPercent ?? 0}%</span>
                  <span className="text-sm font-normal text-slate-400">({stats?.surveyStats.yesCount ?? 0} मत)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${stats?.surveyStats.yesPercent ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Card 3: NO Count & % */}
              <div className="bg-slate-900 border border-rose-900/40 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
                  <span>नहीं (NO) — असहमत/अन्य</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-extrabold text-rose-400 flex items-baseline gap-2">
                  <span>{stats?.surveyStats.noPercent ?? 0}%</span>
                  <span className="text-sm font-normal text-slate-400">({stats?.surveyStats.noCount ?? 0} मत)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-1.5 rounded-full"
                    style={{ width: `${stats?.surveyStats.noPercent ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Card 4: Total Feedback Issues */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>दर्ज ग्राम समस्याएँ</span>
                  <MessageSquareCheck className="w-4 h-4 text-village-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.totalFeedback ?? 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  अति आवश्यक मुद्दे: <strong className="text-rose-400">{stats?.highPriorityCount ?? 0}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: EXPECTATIONS & NO REASONS DEEP DIVE                  */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Expectations from YES voters */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>शीर्ष ग्रामवासी अपेक्षाएँ (Top Expectations)</span>
                  </h3>
                  <p className="text-xs text-slate-400">हाँ उत्तरदाताओं द्वारा चुनी गई प्राथमिकताएँ</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  {stats?.surveyStats.yesCount ?? 0} समर्थक
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(stats?.surveyStats.topExpectations || []).slice(0, 8).map((exp, idx) => (
                  <div key={exp.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {idx + 1}. {exp.labelHi}
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {exp.count} वोट ({exp.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${exp.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Reasons selected by NO voters */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>असहमत नागरिकों के कारण (Reasons for NO)</span>
                  </h3>
                  <p className="text-xs text-slate-400">नहीं उत्तरदाताओं द्वारा चुने गए वैकल्पिक कारण</p>
                </div>
                <span className="text-xs font-mono text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800">
                  {stats?.surveyStats.noCount ?? 0} उत्तरदाता
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(stats?.surveyStats.commonNoReasons || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">अभी कोई कारण दर्ज नहीं हुआ।</p>
                ) : (
                  (stats?.surveyStats.commonNoReasons || []).map((r, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300 line-clamp-1">{r.reason}</span>
                        <span className="text-amber-400 font-bold font-mono shrink-0 ml-2">
                          {r.count} ({r.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: VILLAGE PROBLEMS & RESOLUTION STATUS CHARTS         */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white">
                समस्या श्रेणीवार वितरण (Category Distribution)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                    />
                    <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resolution Status Ratio */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white">
                समस्या समाधान स्थिति अनुपात (Status Ratio)
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                {statusPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {statusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-slate-500">पर्याप्त डेटा उपलब्ध नहीं है</p>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 4: SEARCHABLE FEEDBACK SUBMISSIONS MANAGEMENT          */}
          {/* ============================================================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  दर्ज ग्राम समस्याएँ एवं स्थिति (Village Problems & Status)
                </h3>
                <p className="text-xs text-slate-400">
                  कुल प्रविष्टियाँ: {filteredFeedback.length} / {allFeedbackList.length}
                </p>
              </div>

              <Link
                href="/admin/feedback"
                className="text-xs font-semibold text-village-400 hover:text-village-300"
              >
                विस्तृत प्रबंधन पृष्ठ खोलें →
              </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="समस्या विवरण या वार्ड खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-village-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">सभी श्रेणियाँ (All Categories)</option>
                <option value="water">पेयजल</option>
                <option value="roads">सड़कें</option>
                <option value="drainage">नाली</option>
                <option value="streetlights">स्ट्रीट लाइट</option>
                <option value="education">शिक्षा</option>
                <option value="health">स्वास्थ्य</option>
                <option value="employment">रोजगार</option>
                <option value="govSchemes">योजनाएं</option>
                <option value="cleanliness">स्वच्छता</option>
                <option value="other">अन्य</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">सभी स्थितियाँ (All Status)</option>
                <option value="pending">लंबित (Pending)</option>
                <option value="under_review">समीक्षाधीन (Under Review)</option>
                <option value="addressed">कार्ययोजना में दर्ज (Addressed)</option>
                <option value="resolved">निराकृत (Resolved)</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">श्रेणी</th>
                    <th className="py-3 px-4">स्थान / वार्ड</th>
                    <th className="py-3 px-4">समस्या विवरण</th>
                    <th className="py-3 px-4">प्राथमिकता</th>
                    <th className="py-3 px-4">स्थिति</th>
                    <th className="py-3 px-4 text-right">कार्यवाही</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredFeedback.slice(0, 8).map((item) => (
                    <tr key={item.feedbackId} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                        {item.ward || "वार्ड सामान्य"}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-200">
                        {item.description}
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/feedback?id=${item.feedbackId}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-village-400 font-semibold"
                        >
                          समीक्षा करें
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
