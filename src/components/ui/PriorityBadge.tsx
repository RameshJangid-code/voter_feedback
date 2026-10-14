"use client";

import React from "react";
import { ProblemPriority } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

interface PriorityBadgeProps {
  priority: ProblemPriority;
  className?: string;
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  const { t } = useLanguage();

  if (priority === "high") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        {t.priorityHigh}
      </span>
    );
  }

  if (priority === "medium") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        {t.priorityMedium}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
    >
      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
      {t.priorityLow}
    </span>
  );
}
