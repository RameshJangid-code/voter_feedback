"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { getAggregateStats, getAllFeedback } from "@/lib/dataService";
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
  AlertCircle,
  Clock,
  CheckCircle2,
  Vote,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [recentItems, setRecentItems] = useState<PublicFeedback[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [sData, fData] = await Promise.all([
          getAggregateStats(),
          getAllFeedback(true),
        ]);
        setStats(sData);
        setRecentItems(fData.slice(0, 5));
      } catch (e) {
        console.error("Dashboard data load failed:", e);
      }
    }
    load();
  }, []);

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
        { name: "कार्ययोजना में दर्ज (Addressed)", value: stats.addressedCount, color: "#6366f1" },
        { name: "निराकृत (Resolved)", value: stats.resolvedCount, color: "#10b981" },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  लाइव प्रशासनिक डैशबोर्ड
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 font-hindi">
                बुड़ीवाड़ा जन-संवाद डैशबोर्ड
              </h1>
              <p className="text-xs text-slate-400">
                ग्रामवासियों की प्रतिक्रिया, प्राथमिकताओं एवं गोपनीय जनमत का वास्तविक विश्लेषण
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/feedback"
                className="px-4 py-2.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold shadow transition-colors flex items-center gap-2"
              >
                <MessageSquareCheck className="w-4 h-4" />
                <span>समस्याएं प्रबंधित करें</span>
              </Link>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Total Feedback */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>कुल प्राप्त समस्याएँ</span>
                <MessageSquareCheck className="w-4 h-4 text-village-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {stats?.totalFeedback ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold">{stats?.uniqueRecords ?? 0}</span>
                <span>अद्वितीय प्रविष्टियाँ</span>
              </div>
            </div>

            {/* Card 2: High Priority */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>अति आवश्यक (High Priority)</span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-extrabold text-rose-400">
                {stats?.highPriorityCount ?? 0}
              </div>
              <div className="text-[11px] text-slate-500">
                तत्काल स्थल निरीक्षण योग्य
              </div>
            </div>

            {/* Card 3: Pending Review */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>समीक्षा हेतु लंबित (Pending)</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {stats?.pendingCount ?? 0}
              </div>
              <div className="text-[11px] text-slate-500">
                समीक्षाधीन: {stats?.underReviewCount ?? 0}
              </div>
            </div>

            {/* Card 4: Addressed & Resolved */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>कार्ययोजना में दर्ज / हल</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {stats?.addressedCount ? stats.addressedCount + (stats.resolvedCount || 0) : 0}
              </div>
              <div className="text-[11px] text-slate-500">
                निराकृत: {stats?.resolvedCount ?? 0}
              </div>
            </div>
          </div>

          {/* Anonymous Opinion Poll Aggregated Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-900/40 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Vote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-hindi">
                    अनाम जनमत रुझान (Anonymous Opinion Poll Aggregate)
                  </h3>
                  <p className="text-xs text-slate-400">
                    कुल प्राप्त गोपनीय राय: <strong className="text-white">{stats?.opinionStats.total ?? 0}</strong> (कोई व्यक्तिगत पहचान एकत्र नहीं की जाती)
                  </p>
                </div>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <span>विस्तृत विश्लेषण देखें</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-900/30 space-y-1">
                <span className="text-xs text-emerald-400 font-semibold">श्री मोहन सिंह जी का समर्थन</span>
                <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                  <span>{stats?.opinionStats.supportPercent ?? 0}%</span>
                  <span className="text-xs text-slate-400">({stats?.opinionStats.support ?? 0} मत)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${stats?.opinionStats.supportPercent ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-900/30 space-y-1">
                <span className="text-xs text-amber-400 font-semibold">अभी अनिर्णित (Undecided)</span>
                <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                  <span>{stats?.opinionStats.undecidedPercent ?? 0}%</span>
                  <span className="text-xs text-slate-400">({stats?.opinionStats.undecided ?? 0} मत)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${stats?.opinionStats.undecidedPercent ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-300 font-semibold">अन्य विकल्प पर विचार</span>
                <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                  <span>{stats?.opinionStats.otherPercent ?? 0}%</span>
                  <span className="text-xs text-slate-400">({stats?.opinionStats.other ?? 0} मत)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-slate-400 h-1.5 rounded-full"
                    style={{ width: `${stats?.opinionStats.otherPercent ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Category Distribution */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white font-hindi">
                समस्या श्रेणीवार वितरण (Category Distribution)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                    />
                    <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Resolution Status */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white font-hindi">
                समाधान स्थिति अनुपात (Status Ratio)
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

          {/* Recent Submissions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-hindi">
                  हालिया दर्ज ग्राम समस्याएँ (Recent Village Issues)
                </h3>
                <p className="text-xs text-slate-400">नवीनतम नागरिक प्रविष्टियों की त्वरित समीक्षा</p>
              </div>
              <Link
                href="/admin/feedback"
                className="text-xs font-semibold text-village-400 hover:text-village-300"
              >
                सभी देखें →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">श्रेणी</th>
                    <th className="py-3 px-4">वार्ड</th>
                    <th className="py-3 px-4">समस्या विवरण</th>
                    <th className="py-3 px-4">प्राथमिकता</th>
                    <th className="py-3 px-4">स्थिति</th>
                    <th className="py-3 px-4 text-right">कार्यवाही</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentItems.map((item) => (
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
