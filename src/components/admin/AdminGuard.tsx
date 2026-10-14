"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 text-village-400 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">प्रशासनिक सुरक्षा सत्यापन जारी है...</p>
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
