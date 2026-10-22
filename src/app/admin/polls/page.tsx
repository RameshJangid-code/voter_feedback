"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  getAllPolls,
  createPoll,
  setActivePoll,
  togglePollStatus,
  deletePoll,
  getAggregateStats,
  getPostVoteDetails,
  generatePostVoteDetailsCSV,
  generateSurveyAggregateCSV,
} from "@/lib/dataService";
import { PollItem, AggregateStats, PostVoteDetail } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  Vote,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Trash2,
  TrendingUp,
  User,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

export default function AdminPollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<PollItem[]>([]);
  const [stats, setStats] = useState<AggregateStats | null>(null);
  const [voterDetails, setVoterDetails] = useState<PostVoteDetail[]>([]);


  // Search & Filter for Voter Details
  const [voterSearch, setVoterSearch] = useState("");
  const [phoneOnlyFilter, setPhoneOnlyFilter] = useState(false);

  // New Poll Modal / Form state
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newTitleHi, setNewTitleHi] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newDescHi, setNewDescHi] = useState("");
  const [newDescEn, setNewDescEn] = useState("");
  const [options, setOptions] = useState<Array<{ textHi: string; textEn: string }>>([
    { textHi: "", textEn: "" },
    { textHi: "", textEn: "" },
  ]);
  const [makeActiveImmediately, setMakeActiveImmediately] = useState(true);
  const [creatingPoll, setCreatingPoll] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      const [pData, sData, vData] = await Promise.all([
        getAllPolls(),
        getAggregateStats(),
        getPostVoteDetails(),
      ]);
      setPolls(pData);
      setStats(sData);
      setVoterDetails(vData);
    } catch (e) {
      console.error("Failed to load polls & voter details:", e);
    }
  };


  useEffect(() => {
    loadAll();
  }, []);

  const handleAddOption = () => {
    if (options.length < 2) {
      setOptions([...options, { textHi: "", textEn: "" }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, field: "textHi" | "textEn", val: string) => {
    const next = [...options];
    next[index][field] = val;
    setOptions(next);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitleHi.trim()) {
      setFormError("कृपया पोल का शीर्षक (हिंदी) अवश्य दर्ज करें।");
      return;
    }

    const filledOptions = options.filter((o) => o.textHi.trim() !== "");
    if (filledOptions.length < 2) {
      setFormError("कम से कम 2 विकल्प दर्ज करना अनिवार्य है।");
      return;
    }

    setCreatingPoll(true);
    try {
      await createPoll(
        {
          titleHi: newTitleHi,
          titleEn: newTitleEn,
          descriptionHi: newDescHi,
          descriptionEn: newDescEn,
          options: filledOptions,
          setActive: makeActiveImmediately,
        },
        user?.email || "admin@janawaaz.in"
      );

      setSuccessMsg("नया पोल सफलतापूर्वक बना दिया गया है!");
      setShowNewPollModal(false);
      // Reset form
      setNewTitleHi("");
      setNewTitleEn("");
      setNewDescHi("");
      setNewDescEn("");
      setOptions([
        { textHi: "", textEn: "" },
        { textHi: "", textEn: "" },
      ]);
      await loadAll();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error creating poll:", err);
      setFormError("पोल बनाने में त्रुटि आई। कृपया पुनः प्रयास करें।");
    } finally {
      setCreatingPoll(false);
    }
  };

  const handleSetActive = async (pollId: string) => {
    try {
      await setActivePoll(pollId, user?.email || "admin@janawaaz.in");
      await loadAll();
      setSuccessMsg("सक्रिय पोल अपडेट कर दिया गया है।");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Error setting active poll:", err);
    }
  };

  const handleToggle = async (pollId: string) => {
    try {
      await togglePollStatus(pollId, user?.email || "admin@janawaaz.in");
      await loadAll();
    } catch (err) {
      console.error("Error toggling poll:", err);
    }
  };

  const handleDelete = async (pollId: string) => {
    if (!confirm("क्या आप वाकई इस पोल को हटाना चाहते हैं?")) return;
    try {
      const res = await deletePoll(pollId, user?.email || "admin@janawaaz.in");
      if (res) {
        await loadAll();
        setSuccessMsg("पोल सफलतापूर्वक हटा दिया गया है।");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        alert("डिफ़ॉल्ट पोल को हटाया नहीं जा सकता।");
      }
    } catch (err) {
      console.error("Error deleting poll:", err);
    }
  };

  const handleExportVoterDetails = () => {
    const csvContent = generatePostVoteDetailsCSV(voterDetails);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `janawaaz_registered_voters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSurveyStats = () => {
    if (!stats) return;
    const csvContent = generateSurveyAggregateCSV(stats);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `janawaaz_votes_overview_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter voter details
  const filteredVoters = voterDetails.filter((v) => {
    const matchesSearch =
      v.fullName?.toLowerCase().includes(voterSearch.toLowerCase()) ||
      v.fatherName?.toLowerCase().includes(voterSearch.toLowerCase()) ||
      v.mobileNumber?.includes(voterSearch) ||
      v.locality?.toLowerCase().includes(voterSearch.toLowerCase());

    const matchesPhone = phoneOnlyFilter ? Boolean(v.mobileNumber?.trim()) : true;

    return matchesSearch && matchesPhone;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-h-screen font-hindi">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
                <Vote className="w-3.5 h-3.5" />
                <span>केवल एडमिन के लिए • Admin Only</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                पोल प्रबंधन एवं विस्तृत मत समीक्षा
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                नया पोल बनाएँ, लाइव पोल का संचालन करें एवं जनमत व स्वैच्छिक वोटर विवरण का विस्तृत विश्लेषण देखें
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportSurveyStats}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>मत रिपोर्ट डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNewPollModal(true)}
                className="px-5 py-2.5 rounded-xl bg-village-600 hover:bg-village-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>नया पोल बनाएँ (New Poll)</span>
              </button>
            </div>
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* 1. SECTION: DETAILED OVERVIEW OF VOTES                         */}
          {/* ============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>विस्तृत मत समीक्षा (Detailed Vote Overview)</span>
              </h2>
              <span className="text-xs text-slate-400">
                अंतिम अद्यतन: {new Date().toLocaleTimeString("hi-IN")}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">कुल दर्ज मत (Total Votes)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stats?.surveyStats.totalSurveys || 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  वास्तविक: {stats?.surveyStats.realSurveysCount || 0} | डेमो: {stats?.surveyStats.demoSurveysCount || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-900/40 space-y-1">
                <span className="text-xs text-emerald-400">हाँ (समर्थन विचार)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">
                  {stats?.surveyStats.yesCount || 0}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  कुल का {stats?.surveyStats.yesPercent || 0}% मत
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1">
                <span className="text-xs text-slate-400">नहीं (अन्य/अनिर्णित)</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-300">
                  {stats?.surveyStats.noCount || 0}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  कुल का {stats?.surveyStats.noPercent || 0}% मत
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-900/40 space-y-1">
                <span className="text-xs text-amber-400">पंजीकृत वोटर विवरण</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {voterDetails.length}
                </div>
                <div className="text-[11px] text-amber-400/80">
                  नाम व फोन दर्ज नागरिक
                </div>
              </div>
            </div>

            {/* Visual Vote Balance Bar */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  हाँ (समर्थन): {stats?.surveyStats.yesCount} ({stats?.surveyStats.yesPercent}%)
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  ✕ नहीं (अन्य/असहमत): {stats?.surveyStats.noCount} ({stats?.surveyStats.noPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full transition-all duration-700"
                  style={{ width: `${stats?.surveyStats.yesPercent || 50}%` }}
                />
                <div
                  className="bg-slate-600 h-full transition-all duration-700"
                  style={{ width: `${stats?.surveyStats.noPercent || 50}%` }}
                />
              </div>
            </div>

            {/* Expectations Ranking Table */}
            {stats?.surveyStats.topExpectations && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>ग्रामवासियों की मुख्य अपेक्षाओं का क्रमवार विश्लेषण (Top Expectations)</span>
                  </h3>
                  <span className="text-xs text-slate-400">12 प्राथमिकताओं का विश्लेषण</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.surveyStats.topExpectations.map((exp, idx) => (
                    <div
                      key={exp.key}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-slate-200">
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{exp.labelHi}</span>
                        </span>
                        <span className="text-emerald-400 font-mono">
                          {exp.count} ({exp.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(exp.percent, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 2. SECTION: ALL POLLS MANAGEMENT (ADMIN ONLY)                 */}
          {/* ============================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-amber-400" />
                <span>जनमत पोल सूची व नियंत्रण (Polls Management)</span>
              </h2>
              <span className="text-xs text-slate-400">
                कुल पोल: {polls.length}
              </span>
            </div>

            <div className="space-y-3">
              {polls.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    p.isActive
                      ? "bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/20"
                      : "bg-slate-900/60 border-slate-800 opacity-90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {p.isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>सक्रिय पोल (Active on Site)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700">
                            निष्क्रिय (Inactive)
                          </span>
                        )}
                        {p.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-village-950 text-village-400 text-[10px] font-medium border border-village-800">
                            मुख्य चुनावी सर्वे
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        {p.titleHi}
                      </h3>
                      {p.descriptionHi && (
                        <p className="text-xs text-slate-400">{p.descriptionHi}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {!p.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleSetActive(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>वेबसाइट पर सक्रिय करें</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                        >
                          बंद करें
                        </button>
                      )}

                      {!p.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 transition-colors"
                          title="पोल हटाएँ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options list preview */}
                  <div className="pt-3">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      पोल के विकल्प ({p.options.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {p.options.map((opt, i) => (
                        <div
                          key={opt.id || i}
                          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <span>{opt.textHi}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. SECTION: REGISTERED VOTER DETAILS TABLE                     */}
          {/* ============================================================== */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>वोट के बाद पंजीकृत नागरिकों का विवरण (Voluntary Voter Details)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  उन नागरिकों की सूची जिन्होंने मत देने के बाद स्वेच्छा से अपना नाम, पिता का नाम अथवा मोबाइल नंबर दर्ज किया
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportVoterDetails}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV सूची डाउनलोड</span>
              </button>
            </div>

            {/* Privacy Clarification */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>आचार संहिता व गोपनीयता नोट:</strong> यह सूची मतदाताओं द्वारा केवल संपर्क हेतु स्वैच्छिक रूप से दी गई है। यह उनके दिए गए मत (हाँ अथवा नहीं) से पूर्णतः अलग है।
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={voterSearch}
                  onChange={(e) => setVoterSearch(e.target.value)}
                  placeholder="नाम, पिता का नाम, मोबाइल नंबर अथवा मोहल्ले से खोजें..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:border-village-500 text-xs text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setPhoneOnlyFilter(!phoneOnlyFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  phoneOnlyFilter
                    ? "bg-amber-500 text-slate-950 font-extrabold"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                केवल मोबाइल नंबर वाले ({voterDetails.filter((v) => v.mobileNumber).length})
              </button>
            </div>

            {/* Voter Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="px-4 py-3">नागरिक का नाम</th>
                      <th className="px-4 py-3">पिता का नाम</th>
                      <th className="px-4 py-3">मोबाइल नंबर</th>
                      <th className="px-4 py-3">मोहल्ला / वार्ड</th>
                      <th className="px-4 py-3">अन्य टिप्पणी</th>
                      <th className="px-4 py-3">दिनांक</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredVoters.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          कोई विवरण नहीं मिला।
                        </td>
                      </tr>
                    ) : (
                      filteredVoters.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-white">
                            {v.fullName || "—"}
                            {v.isDemo && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400">
                                डेमो
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-300">
                            {v.fatherName || "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            {v.mobileNumber ? (
                              <a
                                href={`tel:${v.mobileNumber}`}
                                className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-mono"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{v.mobileNumber}</span>
                              </a>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-300">
                            {v.locality ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span>{v.locality}</span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                            {v.notes || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                            {new Date(v.createdAt).toLocaleDateString("hi-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* MODAL: CREATE NEW POLL (ADMIN ONLY)                           */}
          {/* ============================================================== */}
          {showNewPollModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Vote className="w-5 h-5 text-amber-400" />
                    <h3 className="font-extrabold text-white text-lg">
                      नया जनमत पोल बनाएँ (Admin Only)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPollModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleCreatePoll} className="space-y-4">
                  {/* Title Hindi */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-200">
                      पोल का प्रश्न/शीर्षक (हिंदी में) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitleHi}
                      onChange={(e) => setNewTitleHi(e.target.value)}
                      placeholder="उदा. क्या आप गाँव में नए स्वास्थ्य केंद्र के प्रस्ताव से सहमत हैं?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-village-500 text-xs text-white"
                    />
                  </div>

                  {/* Title English */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Question in English (Optional)
                    </label>
                    <input
                      type="text"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Do you agree with the new healthcare proposal?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-village-500 text-xs text-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-300">
                      विवरण / संदर्भ (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      value={newDescHi}
                      onChange={(e) => setNewDescHi(e.target.value)}
                      placeholder="मतदाताओं के लिए संक्षिप्त निर्देश"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-village-500 text-xs text-white"
                    />
                  </div>

                  {/* Poll Options */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-200">
                        मतदान विकल्प (हाँ/समर्थन और नहीं/असहमति) *
                      </label>
                      {options.length < 2 && (
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ विकल्प जोड़ें</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            required
                            value={opt.textHi}
                            onChange={(e) => handleOptionChange(idx, "textHi", e.target.value)}
                            placeholder={`विकल्प ${idx + 1} (उदा. हाँ / नहीं / अन्य)`}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-village-500 text-xs text-white"
                          />
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                              title="विकल्प हटाएँ"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Active Checkbox */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="makeActive"
                      checked={makeActiveImmediately}
                      onChange={(e) => setMakeActiveImmediately(e.target.checked)}
                      className="w-4 h-4 rounded text-village-600 focus:ring-village-500"
                    />
                    <label htmlFor="makeActive" className="text-xs text-slate-300 select-none">
                      इस पोल को तुरंत वेबसाइट पर सक्रिय (Active) करें
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowNewPollModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      disabled={creatingPoll}
                      className="px-6 py-2.5 rounded-xl bg-village-600 hover:bg-village-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                    >
                      {creatingPoll ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>प्रकाशित हो रहा है...</span>
                        </>
                      ) : (
                        <span>पोल प्रकाशित करें</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
