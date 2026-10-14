"use client";

import React from "react";
import { FeedbackStatus } from "@/types";
import { Clock, Eye, Wrench, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const configs: Record<
    FeedbackStatus,
    { labelHi: string; labelEn: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    pending: {
      labelHi: "लंबित (Pending)",
      labelEn: "Pending",
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    under_review: {
      labelHi: "समीक्षाधीन (Under Review)",
      labelEn: "Under Review",
      icon: <Eye className="w-3.5 h-3.5 text-blue-600" />,
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    addressed: {
      labelHi: "कार्य योजना में दर्ज (Addressed)",
      labelEn: "Addressed in Plan",
      icon: <Wrench className="w-3.5 h-3.5 text-indigo-600" />,
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
    },
    resolved: {
      labelHi: "निराकृत (Resolved)",
      labelEn: "Resolved",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
  };

  const item = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.bg} ${item.text} ${item.border} ${className}`}
    >
      {item.icon}
      <span>{item.labelHi}</span>
    </span>
  );
}
