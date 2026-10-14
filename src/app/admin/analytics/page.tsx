"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { getAggregateStats, getAuditLogs } from "@/lib/dataService";
import { AggregateStats, AuditLog, ProblemCategory } from "@/types";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
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
} from "recharts";
import {
  Vote,
  AlertCircle,
  History,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [sData, lData] = await Promise.all([
          getAggregateStats(),
          getAuditLogs(),
        ]);
        setStats(sData);
        setLogs(lData);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    }
    load();
  }, []);

  const opinionChartData = stats
    ? [
        { name: "समर्थन (Support)", count: stats.opinionStats.support, fill: "#15803d" },
        { name: "अनिर्णित (Undecided)", count: stats.opinionStats.undecided, fill: "#f59e0b" },
        { name: "अन्य विकल्प (Other)", count: stats.opinionStats.other, fill: "#64748b" },
      ]
    : [];

  const priorityChartData = stats
    ? [
        { name: "अति आवश्यक (High)", count: stats.highPriorityCount, fill: "#e11d48" },
        { name: "मध्यम (Medium)", count: stats.mediumPriorityCount, fill: "#d97706" },
        { name: "सामान्य (Low)", count: stats.lowPriorityCount, fill: "#10b981" },
      ]
    : [];

  const categorySorted = stats
    ? (Object.entries(stats.categoryCounts) as [ProblemCategory, number][]).sort(
        (a, b) => b[1] - a[1]
      )
    : [];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-hindi">
              आंकड़े एवं जनमत विश्लेषण (Analytics & Opinion Polls)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              ग्रामवासियों द्वारा प्रस्तुत समस्याओं की सांख्यिकी, प्राथमिकताओं का रुझान एवं अनाम जनमत विश्लेषण
            </p>
          </div>

          {/* DEMOCRATIC & ETHICAL NOTICE */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300">प्रशासनिक दिशानिर्देश एवं आचार संहिता:</span>
              <p className="leading-relaxed">
                यह राय-शुमारी स्वैच्छिक एवं पूर्णतः अनाम है। इसका उपयोग केवल गाँव की समग्र प्राथमिकताओं को समझने के लिए है। किसी भी स्थिति में समर्थकों या असहमत नागरिकों की व्यक्ति-वार सूची नहीं बनाई जा सकती। यह चुनावी परिणाम की भविष्यवाणी नहीं करता।
              </p>
            </div>
          </div>

          {/* Section 1: Opinion Poll Deep Dive */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-hindi flex items-center gap-2">
                  <Vote className="w-5 h-5 text-amber-400" />
                  <span>स्वैच्छिक अनाम राय-शुमारी का संकलन</span>
                </h2>
                <p className="text-xs text-slate-400">
                  कुल प्रविष्टियाँ: <strong className="text-white">{stats?.opinionStats.total ?? 0}</strong>
                </p>
              </div>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700 self-start sm:self-auto font-mono">
                100% Anonymized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat 1 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/40 space-y-2">
                <span className="text-xs font-semibold text-emerald-400">
                  श्री मोहन सिंह जी का समर्थन
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.opinionStats.supportPercent ?? 0}%
                </div>
                <p className="text-xs text-slate-400">
                  कुल मत: <strong className="text-slate-200">{stats?.opinionStats.support ?? 0}</strong>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${stats?.opinionStats.supportPercent ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-900/40 space-y-2">
                <span className="text-xs font-semibold text-amber-400">
                  अभी अनिर्णित (Undecided)
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.opinionStats.undecidedPercent ?? 0}%
                </div>
                <p className="text-xs text-slate-400">
                  कुल मत: <strong className="text-slate-200">{stats?.opinionStats.undecided ?? 0}</strong>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${stats?.opinionStats.undecidedPercent ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300">
                  अन्य विकल्प पर विचार
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {stats?.opinionStats.otherPercent ?? 0}%
                </div>
                <p className="text-xs text-slate-400">
                  कुल मत: <strong className="text-slate-200">{stats?.opinionStats.other ?? 0}</strong>
                </p>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-400 h-2 rounded-full"
                    style={{ width: `${stats?.opinionStats.otherPercent ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Opinion Chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opinionChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 2: Problem Priorities & Urgency Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Rankings */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white font-hindi">
                समस्याओं की रैंकिंग (Category Ranking by Volume)
              </h3>
              <div className="space-y-3">
                {categorySorted.map(([cat, count], idx) => {
                  const total = stats?.totalFeedback || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                          {idx + 1}
                        </span>
                        <CategoryBadge category={cat} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{pct}%</span>
                        <span className="font-bold text-white font-mono">{count} प्रविष्टियाँ</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority Urgency Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white font-hindi">
                गंभीरता / तत्कालिकता स्तर (Urgency Breakdown)
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section 3: Administrative Action Audit Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-hindi flex items-center gap-2">
                  <History className="w-4 h-4 text-village-400" />
                  <span>प्रशासनिक ऑडिट लॉग (Audit Trail)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  जवाबदेही और सुरक्षा हेतु प्रत्येक प्रशासनिक कार्य का रिकॉर्ड
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                कुल लॉग: {logs.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">समय (Timestamp)</th>
                    <th className="py-2.5 px-4">प्रशासक</th>
                    <th className="py-2.5 px-4">कार्यवाही (Action)</th>
                    <th className="py-2.5 px-4">टारगेट</th>
                    <th className="py-2.5 px-4">विवरण</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {logs.slice(0, 10).map((log) => (
                    <tr key={log.logId} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("hi-IN")}
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-sans">
                        {log.adminEmail}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        {log.targetId}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 font-sans max-w-sm truncate">
                        {log.details}
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
