"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { getSiteContent, updateSiteContent } from "@/lib/dataService";
import {
  SiteContent,
  VillagePriorityItem,
  FAQItem,
  AnnouncementItem,
} from "@/types";
import {
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Bell,
} from "lucide-react";

export default function AdminContentPage() {
  const { user } = useAuth();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active Tab: "bio" | "priorities" | "announcements" | "faqs" | "contact"
  const [activeTab, setActiveTab] = useState<"bio" | "priorities" | "announcements" | "faqs" | "contact">("bio");

  useEffect(() => {
    getSiteContent().then((data) => {
      setContent(data);
    });
  }, []);

  const handleSave = async () => {
    if (!content || !user) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await updateSiteContent(content, user.email);
      setContent(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Save content failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // Helpers to mutate sub-arrays
  const updatePriority = (index: number, field: keyof VillagePriorityItem, value: string) => {
    if (!content) return;
    const newPriorities = [...content.priorities];
    newPriorities[index] = { ...newPriorities[index], [field]: value };
    setContent({ ...content, priorities: newPriorities });
  };

  const addPriority = () => {
    if (!content) return;
    const newItem: VillagePriorityItem = {
      id: `p-${Date.now()}`,
      titleHi: "नई विकास प्राथमिकता",
      titleEn: "New Development Priority",
      descHi: "विवरण यहाँ लिखें...",
      descEn: "Write description here...",
      icon: "Shield",
    };
    setContent({ ...content, priorities: [...content.priorities, newItem] });
  };

  const deletePriority = (index: number) => {
    if (!content) return;
    const newPriorities = content.priorities.filter((_, i) => i !== index);
    setContent({ ...content, priorities: newPriorities });
  };

  const updateAnnouncement = (index: number, field: keyof AnnouncementItem, value: string | boolean | undefined) => {
    if (!content) return;
    const newItems = [...content.announcements];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, announcements: newItems });
  };

  const addAnnouncement = () => {
    if (!content) return;
    const newItem: AnnouncementItem = {
      id: `a-${Date.now()}`,
      titleHi: "नवीनतम सार्वजनिक सूचना",
      titleEn: "New Public Announcement",
      date: new Date().toISOString().split("T")[0],
      contentHi: "सूचना का विवरण यहाँ लिखें...",
      contentEn: "Write announcement details...",
      isUrgent: false,
    };
    setContent({ ...content, announcements: [newItem, ...content.announcements] });
  };

  const deleteAnnouncement = (index: number) => {
    if (!content) return;
    const newItems = content.announcements.filter((_, i) => i !== index);
    setContent({ ...content, announcements: newItems });
  };

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    if (!content) return;
    const newFaqs = [...content.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setContent({ ...content, faqs: newFaqs });
  };

  const addFAQ = () => {
    if (!content) return;
    const newItem: FAQItem = {
      id: `f-${Date.now()}`,
      qHi: "नया प्रश्न?",
      qEn: "New Question?",
      aHi: "उत्तर यहाँ दर्ज करें...",
      aEn: "Enter answer here...",
    };
    setContent({ ...content, faqs: [...content.faqs, newItem] });
  };

  const deleteFAQ = (index: number) => {
    if (!content) return;
    const newFaqs = content.faqs.filter((_, i) => i !== index);
    setContent({ ...content, faqs: newFaqs });
  };

  if (!content) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          लोड हो रहा है...
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-hindi">
                वेबसाइट सामग्री प्रबंधन (CMS)
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                प्रत्याशी परिचय, विकास प्राथमिकताएं, संपर्क विवरण, सार्वजनिक सूचनाएं एवं एफएक्यू का संपादन
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-village-700 hover:bg-village-600 active:scale-[0.99] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "सहेजा जा रहा है..." : "सभी परिवर्तन सहेजें (Save Content)"}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>सामग्री सफलतापूर्वक अपडेट की गई और वेबसाइट पर तुरंत लागू हो गई।</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab("bio")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "bio"
                  ? "bg-village-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              प्रत्याशी परिचय एवं संकल्प
            </button>
            <button
              onClick={() => setActiveTab("priorities")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "priorities"
                  ? "bg-village-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              विकास प्राथमिकताएं ({content.priorities.length})
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "announcements"
                  ? "bg-village-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              सार्वजनिक सूचनाएं ({content.announcements.length})
            </button>
            <button
              onClick={() => setActiveTab("faqs")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "faqs"
                  ? "bg-village-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              एफएक्यू (FAQs) ({content.faqs.length})
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "contact"
                  ? "bg-village-700 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              कार्यालय एवं संपर्क विवरण
            </button>
          </div>

          {/* TAB 1: BIO & INTRO */}
          {activeTab === "bio" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    प्रत्याशी का नाम:
                  </label>
                  <input
                    type="text"
                    value={content.candidateName}
                    onChange={(e) => setContent({ ...content, candidateName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    ग्राम पंचायत:
                  </label>
                  <input
                    type="text"
                    value={content.village}
                    onChange={(e) => setContent({ ...content, village: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    प्रत्याशी श्रेणी (Category):
                  </label>
                  <input
                    type="text"
                    value={content.candidateCategory}
                    onChange={(e) => setContent({ ...content, candidateCategory: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  प्रत्याशी परिचय (हिन्दी):
                </label>
                <textarea
                  rows={4}
                  value={content.bioHindi}
                  onChange={(e) => setContent({ ...content, bioHindi: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Candidate Bio (English):
                </label>
                <textarea
                  rows={3}
                  value={content.bioEnglish}
                  onChange={(e) => setContent({ ...content, bioEnglish: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    संकल्प / दृष्टिकोण (हिन्दी):
                  </label>
                  <textarea
                    rows={3}
                    value={content.visionHindi}
                    onChange={(e) => setContent({ ...content, visionHindi: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Vision (English):
                  </label>
                  <textarea
                    rows={3}
                    value={content.visionEnglish}
                    onChange={(e) => setContent({ ...content, visionEnglish: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 leading-relaxed font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEVELOPMENT PRIORITIES */}
          {activeTab === "priorities" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  गाँव के विकास के प्राथमिक स्तंभ (होम पेज पर प्रदर्शित)
                </p>
                <button
                  onClick={addPriority}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>नई प्राथमिकता जोड़ें</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.priorities.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-village-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        प्राथमिकता #{idx + 1}
                      </span>
                      <button
                        onClick={() => deletePriority(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">शीर्षक (हिन्दी):</label>
                      <input
                        type="text"
                        value={item.titleHi}
                        onChange={(e) => updatePriority(idx, "titleHi", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">विवरण (हिन्दी):</label>
                      <textarea
                        rows={2}
                        value={item.descHi}
                        onChange={(e) => updatePriority(idx, "descHi", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  सार्वजनिक सूचनाएं (वेबसाइट के शीर्ष बैनर एवं नोटिस बोर्ड पर दिखाई देती हैं)
                </p>
                <button
                  onClick={addAnnouncement}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>नई सूचना जारी करें</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.announcements.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Bell className="w-3.5 h-3.5" />
                          <span>सूचना #{idx + 1}</span>
                        </span>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => updateAnnouncement(idx, "date", e.target.value)}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                        />
                      </div>
                      <button
                        onClick={() => deleteAnnouncement(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">शीर्षक (हिन्दी):</label>
                        <input
                          type="text"
                          value={item.titleHi}
                          onChange={(e) => updateAnnouncement(idx, "titleHi", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Title (English):</label>
                        <input
                          type="text"
                          value={item.titleEn}
                          onChange={(e) => updateAnnouncement(idx, "titleEn", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">सूचना का विवरण:</label>
                      <textarea
                        rows={2}
                        value={item.contentHi}
                        onChange={(e) => updateAnnouncement(idx, "contentHi", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  सामान्य प्रश्नोत्तर (परिचय पृष्ठ पर प्रदर्शित)
                </p>
                <button
                  onClick={addFAQ}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया प्रश्न जोड़ें</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div
                    key={faq.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        प्रश्न #{idx + 1}
                      </span>
                      <button
                        onClick={() => deleteFAQ(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">प्रश्न (हिन्दी):</label>
                      <input
                        type="text"
                        value={faq.qHi}
                        onChange={(e) => updateFAQ(idx, "qHi", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">उत्तर (हिन्दी):</label>
                      <textarea
                        rows={2}
                        value={faq.aHi}
                        onChange={(e) => updateFAQ(idx, "aHi", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & OFFICE */}
          {activeTab === "contact" && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  कार्यालय / जन-संपर्क केंद्र का पता (हिन्दी):
                </label>
                <input
                  type="text"
                  value={content.contact.addressHi}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, addressHi: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  जन-सुनवाई एवं मिलने का समय (हिन्दी):
                </label>
                <input
                  type="text"
                  value={content.contact.visitingHoursHi}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, visitingHoursHi: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    हेल्पलाइन मोबाइल नंबर:
                  </label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    आधिकारिक ईमेल:
                  </label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-village-600 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
