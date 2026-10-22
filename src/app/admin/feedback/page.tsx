"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import {
  getAllFeedback,
  updateFeedbackItem,
  generateFeedbackCSV,
  getFollowupRequests,
} from "@/lib/dataService";
import {
  PublicFeedback,
  ProblemCategory,
  ProblemPriority,
  FeedbackStatus,
  ModerationStatus,
  FollowupRequest,
} from "@/types";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  Shield,
  Save,
  X,
  Lock,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<PublicFeedback[]>([]);
  const [followupList, setFollowupList] = useState<FollowupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackLoadError, setFeedbackLoadError] = useState<string | null>(null);
  const [followupLoadError, setFollowupLoadError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterModeration, setFilterModeration] = useState<string>("all");

  // Selected item modal for editing
  const [selectedItem, setSelectedItem] = useState<PublicFeedback | null>(null);
  const [editStatus, setEditStatus] = useState<FeedbackStatus>("pending");
  const [editModeration, setEditModeration] = useState<ModerationStatus>("approved");
  const [editPriority, setEditPriority] = useState<ProblemPriority>("medium");
  const [editCategory, setEditCategory] = useState<ProblemCategory>("water");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setFeedbackLoadError(null);
    setFollowupLoadError(null);

    const [feedbackResult, followupResult] = await Promise.allSettled([
      getAllFeedback(true),
      getFollowupRequests(),
    ]);

    if (feedbackResult.status === "fulfilled") {
      setFeedbackList(feedbackResult.value);
    } else {
      console.error("Failed to load feedback:", feedbackResult.reason);
      setFeedbackLoadError(
        feedbackResult.reason instanceof Error
          ? feedbackResult.reason.message
          : "समस्या सूची लोड नहीं हो सकी।"
      );
    }

    if (followupResult.status === "fulfilled") {
      setFollowupList(followupResult.value);
    } else {
      console.error("Failed to load follow-up requests:", followupResult.reason);
      setFollowupLoadError(
        followupResult.reason instanceof Error
          ? followupResult.reason.message
          : "संपर्क अनुरोध लोड नहीं हो सके।"
      );
    }

    setIsLoading(false);
  };

  const openEditModal = (item: PublicFeedback) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditModeration(item.moderationStatus);
    setEditPriority(item.priority);
    setEditCategory(item.category);
    setInternalNotes(item.internalNotes || "");
    setSaveSuccess(false);
  };

  const handleSaveItem = async () => {
    if (!selectedItem || !user) return;
    setSaving(true);
    try {
      const updated = await updateFeedbackItem(
        selectedItem.feedbackId,
        {
          status: editStatus,
          moderationStatus: editModeration,
          priority: editPriority,
          category: editCategory,
          internalNotes,
        },
        user.email
      );
      if (updated) {
        setFeedbackList((prev) =>
          prev.map((f) => (f.feedbackId === updated.feedbackId ? updated : f))
        );
        setSelectedItem(updated);
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent = generateFeedbackCSV(filteredItems);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `janawaaz_village_feedback_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find related follow-up details if consent was given
  const currentFollowup = selectedItem
    ? followupList.find((r) => r.relatedFeedbackId === selectedItem.feedbackId)
    : null;

  // Filter logic
  const filteredItems = feedbackList.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedImprovement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ward && item.ward.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.internalNotes && item.internalNotes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesModeration =
      filterModeration === "all" || item.moderationStatus === filterModeration;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesModeration;
  });

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-hindi">
                समस्या व सुझाव प्रबंधन (Feedback Management)
              </h1>
              <p className="text-xs text-slate-400">
                ग्रामवासियों द्वारा दर्ज की गई समस्याओं की समीक्षा, वर्गीकरण, समाधान स्थिति एवं सार्वजनिक दृश्यता नियंत्रण
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold shadow transition-all self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV में डाउनलोड करें ({filteredItems.length})</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="खोजें (विवरण, सुझाव, वार्ड, या आंतरिक नोट्स)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-village-600 outline-none"
                />
              </div>

              {/* Category filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-village-600 outline-none"
              >
                <option value="all">सभी श्रेणियां</option>
                <option value="water">पेयजल</option>
                <option value="roads">सड़क व गली</option>
                <option value="drainage">नाली व निकासी</option>
                <option value="streetlights">स्ट्रीट लाइट</option>
                <option value="education">शिक्षा</option>
                <option value="health">स्वास्थ्य</option>
                <option value="employment">रोजगार</option>
                <option value="govSchemes">सरकारी योजनाएं</option>
                <option value="cleanliness">सफाई</option>
                <option value="other">अन्य</option>
              </select>

              {/* Priority filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-village-600 outline-none"
              >
                <option value="all">सभी प्राथमिकताएं</option>
                <option value="high">उच्च (High)</option>
                <option value="medium">मध्यम (Medium)</option>
                <option value="low">सामान्य (Low)</option>
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-village-600 outline-none"
              >
                <option value="all">सभी स्थितियां</option>
                <option value="pending">लंबित (Pending)</option>
                <option value="under_review">समीक्षाधीन (Under Review)</option>
                <option value="addressed">कार्ययोजना में दर्ज (Addressed)</option>
                <option value="resolved">निराकृत (Resolved)</option>
              </select>

              {/* Moderation filter */}
              <select
                value={filterModeration}
                onChange={(e) => setFilterModeration(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-village-600 outline-none"
              >
                <option value="all">सार्वजनिक दृश्यता</option>
                <option value="approved">स्वीकृत (Approved)</option>
                <option value="hidden">छिपाया गया (Hidden / Spam)</option>
              </select>
            </div>
          </div>

          {feedbackLoadError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-2xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>समस्या सूची लोड नहीं हो सकी: {feedbackLoadError}</span>
              <button
                onClick={loadData}
                className="self-start rounded-lg border border-rose-700 px-3 py-1.5 text-xs font-semibold hover:bg-rose-900/50 sm:self-auto"
              >
                फिर से कोशिश करें
              </button>
            </div>
          )}

          {followupLoadError && !feedbackLoadError && (
            <div
              role="status"
              className="rounded-2xl border border-amber-800 bg-amber-950/30 p-4 text-xs text-amber-200"
            >
              समस्या सूची लोड हो गई है, लेकिन संपर्क अनुरोध लोड नहीं हो सके: {followupLoadError}
            </div>
          )}

          {/* Feedback Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">श्रेणी</th>
                    <th className="py-3 px-4">वार्ड</th>
                    <th className="py-3 px-4">समस्या विवरण</th>
                    <th className="py-3 px-4">सुझाव</th>
                    <th className="py-3 px-4">प्राथमिकता</th>
                    <th className="py-3 px-4">प्रगति स्थिति</th>
                    <th className="py-3 px-4">दृश्यता</th>
                    <th className="py-3 px-4 text-right">समीक्षा व संपादन</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        {isLoading
                          ? "समस्याएं लोड हो रही हैं..."
                          : feedbackLoadError
                            ? "समस्या सूची उपलब्ध नहीं है। ऊपर दिया गया संदेश देखें।"
                            : "कोई मेल खाती प्रविष्टि नहीं मिली।"}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.feedbackId} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <CategoryBadge category={item.category} />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-white">
                          {item.ward || "वार्ड सामान्य"}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-200">
                          {item.description}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                          {item.suggestedImprovement || "—"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <PriorityBadge priority={item.priority} />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {item.moderationStatus === "approved" ? (
                            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                              सार्वजनिक
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-950/60 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full font-semibold">
                              छिपाया गया
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-village-700/80 hover:bg-village-700 text-white font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>प्रबंधित करें</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT & DETAIL MODAL */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      आईडी: {selectedItem.feedbackId}
                    </span>
                    <h3 className="text-xl font-bold text-white font-hindi">
                      समस्या विवरण एवं प्रशासनिक कार्यवाही
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>परिवर्तन सफलतापूर्वक सहेजे गए और ऑडिट लॉग दर्ज किया गया।</span>
                  </div>
                )}

                {/* Submitted Problem Details */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">
                      वार्ड: {selectedItem.ward || "सामान्य"}
                    </span>
                    <span>
                      दर्ज दिनांक: {new Date(selectedItem.createdAt).toLocaleString("hi-IN")}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1">
                      समस्या विवरण:
                    </span>
                    <p className="text-sm text-slate-100 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {selectedItem.description}
                    </p>
                  </div>

                  {selectedItem.suggestedImprovement && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        अपेक्षित सुधार:
                      </span>
                      <p className="text-sm text-emerald-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {selectedItem.suggestedImprovement}
                      </p>
                    </div>
                  )}

                  {selectedItem.villageDevelopmentSuggestion && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-1">
                        ग्राम विकास हेतु सुझाव:
                      </span>
                      <p className="text-sm text-amber-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {selectedItem.villageDevelopmentSuggestion}
                      </p>
                    </div>
                  )}
                </div>

                {/* ASSOCIATED FOLLOW-UP CONTACT DETAILS (IF CONSENTED) */}
                {currentFollowup ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-village-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-village-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>सहमति-आधारित संपर्क विवरण (Follow-up Contact)</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        सत्यापित सहमति
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">नाम:</span>
                        <span className="text-white font-medium">{currentFollowup.contactName || "—"}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">मोबाइल:</span>
                        <span className="text-emerald-400 font-mono font-medium">{currentFollowup.contactPhone || "—"}</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">वार्ड / मोहल्ला:</span>
                        <span className="text-white font-medium">{currentFollowup.ward || "—"}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      * यह संपर्क विवरण राजनीतिक राय-शुमारी से पूर्णतः पृथक है और केवल समस्या निवारण हेतु प्रयुक्त होगा।
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>नागरिक ने संपर्क विवरण साझा नहीं किया (पूर्णतः अनाम प्रविष्टि)।</span>
                  </div>
                )}

                {/* EDIT CONTROLS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status update */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      प्रगति स्थिति (Status):
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as FeedbackStatus)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-village-600"
                    >
                      <option value="pending">लंबित (Pending)</option>
                      <option value="under_review">समीक्षाधीन (Under Review)</option>
                      <option value="addressed">कार्ययोजना में दर्ज (Addressed)</option>
                      <option value="resolved">निराकृत (Resolved)</option>
                    </select>
                  </div>

                  {/* Public moderation status */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      सार्वजनिक प्रदर्शन (Moderation):
                    </label>
                    <select
                      value={editModeration}
                      onChange={(e) => setEditModeration(e.target.value as ModerationStatus)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-village-600"
                    >
                      <option value="approved">स्वीकृत (सार्वजनिक रूप से दिखाएं)</option>
                      <option value="hidden">छिपाएं (अनुपयुक्त / स्पैम / अस्वीकृत)</option>
                    </select>
                  </div>

                  {/* Priority reclassification */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      प्राथमिकता स्तर (Priority):
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as ProblemPriority)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-village-600"
                    >
                      <option value="high">उच्च प्राथमिकता (High)</option>
                      <option value="medium">मध्यम (Medium)</option>
                      <option value="low">सामान्य (Low)</option>
                    </select>
                  </div>

                  {/* Category reclassification */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      विषय श्रेणी (Category):
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as ProblemCategory)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-village-600"
                    >
                      <option value="water">पेयजल</option>
                      <option value="roads">सड़क व गली</option>
                      <option value="drainage">नाली व निकासी</option>
                      <option value="streetlights">स्ट्रीट लाइट</option>
                      <option value="education">शिक्षा</option>
                      <option value="health">स्वास्थ्य</option>
                      <option value="employment">रोजगार</option>
                      <option value="govSchemes">सरकारी योजनाएं</option>
                      <option value="cleanliness">सफाई</option>
                      <option value="other">अन्य</option>
                    </select>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    आंतरिक प्रशासनिक नोट्स (Internal Notes - केवल अधिकृत एडमिन को दिखाई देंगे):
                  </label>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="उदा. स्थल निरीक्षण 15 अक्टूबर को निर्धारित, पीएचईडी विभाग को पत्र भेजा गया..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-village-600"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedItem(null)}
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    रद्द करें
                  </button>
                  <button
                    onClick={handleSaveItem}
                    disabled={saving}
                    type="button"
                    className="px-6 py-2.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-bold shadow flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "सहेजा जा रहा है..." : "परिवर्तन सहेजें"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
