"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !authError) {
      router.push("/admin/login");
    }
  }, [user, loading, authError, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 text-village-400 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">प्रशासनिक सुरक्षा सत्यापन जारी है...</p>
      </div>
    );
  }

  if (!user && authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">व्यवस्थापक सत्यापन पूरा नहीं हुआ</h2>
        <p role="alert" className="text-sm text-slate-300 mb-6 text-center max-w-lg">
          {authError}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-village-700 px-4 py-2 text-sm font-semibold hover:bg-village-600"
          >
            फिर से जांचें
          </button>
          <Link
            href="/admin/login"
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            लॉगिन पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">अनधिकृत प्रवेश (Unauthorized Access)</h2>
        <p className="text-sm text-slate-400 mb-6 text-center max-w-md">
          इस पृष्ठ को केवल अधिकृत व्यवस्थापक ही देख सकते हैं। कृपया पहले लॉगिन करें।
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
