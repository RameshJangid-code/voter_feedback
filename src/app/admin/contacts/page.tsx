"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAuth } from "@/context/AuthContext";
import { getContactRequests, updateContactRequestStatus, generateContactsCSV } from "@/lib/dataService";
import { FollowupRequest } from "@/types";
import {
  Download,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Users,
  ShieldCheck,
  Edit3,
  X,
  Save,
} from "lucide-react";

export default function AdminContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<FollowupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected item for updating status and notes
  const [editingItem, setEditingItem] = useState<FollowupRequest | null>(null);
  const [newStatus, setNewStatus] = useState<"new" | "contacted" | "in_progress" | "resolved">("new");
  const [notesText, setNotesText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await getContactRequests();
      setContacts(data);
    } catch (e) {
      console.error("Failed to load contact requests:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: FollowupRequest) => {
    setEditingItem(item);
    setNewStatus(item.status || "new");
    setNotesText(item.adminNotes || "");
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      await updateContactRequestStatus(
        editingItem.requestId,
        {
          status: newStatus,
          adminNotes: notesText.trim(),
        },
        user?.email || "admin@budivada.in"
      );
      setEditingItem(null);
      await loadContacts();
    } catch (err) {
      console.error("Failed to save contact status:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = generateContactsCSV(contacts);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `budivada_contact_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredContacts = contacts.filter((c) => {
    const nameMatch = (c.fullName || c.contactName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (c.mobileNumber || c.contactPhone || "").includes(searchQuery);
    const localityMatch = (c.locality || c.ward || "").toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = (c.subjectOrProblem || "").toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatches = nameMatch || phoneMatch || localityMatch || subjectMatch;

    const currentStatus = c.status || "new";
    const statusMatches = statusFilter === "all" || currentStatus === statusFilter;

    return queryMatches && statusMatches;
  });

  const newCount = contacts.filter((c) => !c.status || c.status === "new").length;
  const contactedCount = contacts.filter((c) => c.status === "contacted" || c.status === "in_progress").length;
  const resolvedCount = contacts.filter((c) => c.status === "resolved").length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-hindi">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  प्रतिबंधित प्रशासनिक अनुभाग
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                स्वैच्छिक संपर्क अनुरोध (Voluntary Contact Requests)
              </h1>
              <p className="text-xs text-slate-400">
                गाँव की समस्याओं के समाधान व स्थल निरीक्षण हेतु नागरिकों द्वारा प्रस्तुत स्वैच्छिक संपर्क विवरण
              </p>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-semibold shadow transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>संपर्क सूची CSV डाउनलोड</span>
            </button>
          </div>

          {/* Privacy Segregation Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3.5 text-xs text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-emerald-300 font-bold block">
                गोपनीयता नियम एवं डेटा पृथक्करण:
              </strong>
              <p className="leading-relaxed">
                इस सूची में केवल वही नागरिक हैं जिन्होंने अपनी समस्या या सुझाव पर चर्चा हेतु संपर्क करने की <strong>स्पष्ट सहमति (Consent)</strong> दी है। इस पृष्ठ पर किसी भी नागरिक का राजनीतिक मत (हाँ/नहीं वोट प्राथमिकता) कभी भी प्रदर्शित नहीं किया जाता और न ही डेटाबेस में लिंक किया गया है।
              </p>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">कुल संपर्क अनुरोध</span>
              <div className="text-2xl font-extrabold text-white">{contacts.length}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-amber-400">नए अनुरोध (लंबित)</span>
              <div className="text-2xl font-extrabold text-amber-400">{newCount}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-blue-400">संवाद प्रक्रियाधीन</span>
              <div className="text-2xl font-extrabold text-blue-400">{contactedCount}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-emerald-400">निराकृत / पूर्ण</span>
              <div className="text-2xl font-extrabold text-emerald-400">{resolvedCount}</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="नाम, मोबाइल नंबर, मोहल्ला या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-village-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-village-500"
              >
                <option value="all">सभी स्थितियां (All Status)</option>
                <option value="new">नया (New)</option>
                <option value="contacted">संपर्क किया गया (Contacted)</option>
                <option value="in_progress">प्रक्रियाधीन (In Progress)</option>
                <option value="resolved">निराकृत (Resolved)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                डेटा लोड हो रहा है...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                कोई संपर्क अनुरोध नहीं मिला।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">नागरिक का नाम व पिता</th>
                      <th className="py-3 px-4">मोबाइल नंबर</th>
                      <th className="py-3 px-4">स्थान / मोहल्ला</th>
                      <th className="py-3 px-4">पसंदीदा माध्यम</th>
                      <th className="py-3 px-4">विषय / समस्या विवरण</th>
                      <th className="py-3 px-4">दिनांक</th>
                      <th className="py-3 px-4">स्थिति</th>
                      <th className="py-3 px-4 text-right">कार्यवाही</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredContacts.map((item) => {
                      const cleanPhone = (item.mobileNumber || item.contactPhone || "").replace(/\D/g, "");
                      const currentStatus = item.status || "new";

                      return (
                        <tr key={item.requestId} className="hover:bg-slate-850/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">
                              {item.fullName || item.contactName || "अनाम"}
                            </div>
                            {item.fatherName && (
                              <div className="text-[11px] text-slate-400">
                                पिता: {item.fatherName}
                              </div>
                            )}
                            {item.isDemo && (
                              <span className="inline-block mt-1 text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                                डेमो प्रविष्टि
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{item.mobileNumber || item.contactPhone}</span>
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 hover:bg-emerald-900"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-slate-300">
                              {item.locality || item.ward || "निर्दिष्ट नहीं"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                              {item.preferredContactMethod === "whatsapp" ? (
                                <>
                                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                                  <span>व्हाट्सएप</span>
                                </>
                              ) : item.preferredContactMethod === "in_person" ? (
                                <>
                                  <Users className="w-3 h-3 text-amber-400" />
                                  <span>व्यक्तिगत भेंट</span>
                                </>
                              ) : (
                                <>
                                  <Phone className="w-3 h-3 text-blue-400" />
                                  <span>फ़ोन कॉल</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="line-clamp-2 text-slate-200">
                              {item.subjectOrProblem || "कोई विशेष विवरण नहीं दिया"}
                            </p>
                            {item.adminNotes && (
                              <p className="mt-1 text-[11px] text-amber-300 line-clamp-1 italic">
                                नोट: {item.adminNotes}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString("hi-IN")}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                currentStatus === "resolved"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                                  : currentStatus === "in_progress" || currentStatus === "contacted"
                                  ? "bg-blue-950 text-blue-300 border border-blue-700"
                                  : "bg-amber-950 text-amber-300 border border-amber-700"
                              }`}
                            >
                              {currentStatus === "resolved"
                                ? "निराकृत"
                                : currentStatus === "in_progress"
                                ? "प्रक्रियाधीन"
                                : currentStatus === "contacted"
                                ? "संपर्क किया"
                                : "नया"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-village-400" />
                              <span>अद्यतन</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* EDIT MODAL */}
          {editingItem && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">संपर्क स्थिति अद्यतन करें</h3>
                    <p className="text-xs text-slate-400">{editingItem.fullName || editingItem.contactName}</p>
                  </div>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      वर्तमान स्थिति (Status):
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as "new" | "contacted" | "in_progress" | "resolved")}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
                    >
                      <option value="new">नया (New / Pending)</option>
                      <option value="contacted">संपर्क किया गया (Contacted)</option>
                      <option value="in_progress">कार्यवाही प्रक्रियाधीन (In Progress)</option>
                      <option value="resolved">निराकृत / पूर्ण (Resolved)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      आंतरिक प्रशासनिक नोट (Internal Action Notes):
                    </label>
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="नागरिक से क्या बातचीत हुई अथवा क्या कदम उठाया गया..."
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    रद्द करें
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-village-700 hover:bg-village-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "सहेजा जा रहा है..." : "सहेजें (Save)"}</span>
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
