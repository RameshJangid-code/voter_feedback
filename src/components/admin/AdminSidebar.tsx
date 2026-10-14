"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  MessageSquareCheck,
  BarChart3,
  FileEdit,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      href: "/admin/dashboard",
      labelHi: "डैशबोर्ड अवलोकन",
      labelEn: "Dashboard Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      href: "/admin/feedback",
      labelHi: "समस्या व सुझाव प्रबंधन",
      labelEn: "Feedback Management",
      icon: <MessageSquareCheck className="w-5 h-5" />,
    },
    {
      href: "/admin/analytics",
      labelHi: "आंकड़े एवं जनमत विश्लेषण",
      labelEn: "Analytics & Polls",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      href: "/admin/content",
      labelHi: "वेबसाइट सामग्री प्रबंधन",
      labelEn: "Content Management",
      icon: <FileEdit className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-village-700 flex items-center justify-center font-bold text-sm">
            म
          </div>
          <div>
            <div className="text-sm font-bold">प्रशासन पैनल</div>
            <div className="text-[10px] text-slate-400">बुड़ीवाड़ा जन-संवाद</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:h-screen lg:shrink-0 border-r border-slate-800`}
      >
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-village-700 text-white flex items-center justify-center font-bold text-lg shadow">
                म
              </div>
              <div>
                <h2 className="font-bold text-base text-white">व्यवस्थापक पैनल</h2>
                <p className="text-xs text-village-400 font-medium">बुड़ीवाड़ा सरपंच चुनाव 2026</p>
              </div>
            </div>
            <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate text-xs">
                <span className="text-slate-400 block text-[10px]">लॉगिन प्रशासक:</span>
                <span className="text-slate-200 font-mono truncate">{user?.email || "अधिकृत एडमिन"}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              प्रशासन मेनू
            </div>
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-village-700 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-400"}>{link.icon}</span>
                  <div>
                    <div>{link.labelHi}</div>
                    <div className="text-[10px] opacity-75 font-normal">{link.labelEn}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-village-400" />
              <span>पब्लिक वेबसाइट देखें</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">नई विंडो</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट करें (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
