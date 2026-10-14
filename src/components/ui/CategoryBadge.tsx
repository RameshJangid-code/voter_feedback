"use client";

import React from "react";
import { ProblemCategory } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  Droplets,
  Milestone,
  Waves,
  Lightbulb,
  GraduationCap,
  HeartPulse,
  Briefcase,
  FileText,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface CategoryBadgeProps {
  category: ProblemCategory;
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ category, showIcon = true, className = "" }: CategoryBadgeProps) {
  const { t } = useLanguage();

  const config: Record<
    ProblemCategory,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    water: {
      label: t.catWater,
      icon: <Droplets className="w-3.5 h-3.5 text-blue-600" />,
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    roads: {
      label: t.catRoads,
      icon: <Milestone className="w-3.5 h-3.5 text-amber-700" />,
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    drainage: {
      label: t.catDrainage,
      icon: <Waves className="w-3.5 h-3.5 text-cyan-700" />,
      bg: "bg-cyan-50",
      text: "text-cyan-800",
      border: "border-cyan-200",
    },
    streetlights: {
      label: t.catStreetlights,
      icon: <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />,
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    education: {
      label: t.catEducation,
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />,
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
    },
    health: {
      label: t.catHealth,
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
    },
    employment: {
      label: t.catEmployment,
      icon: <Briefcase className="w-3.5 h-3.5 text-purple-600" />,
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    govSchemes: {
      label: t.catGovSchemes,
      icon: <FileText className="w-3.5 h-3.5 text-teal-600" />,
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
    },
    cleanliness: {
      label: t.catCleanliness,
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
    other: {
      label: t.catOther,
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-600" />,
      bg: "bg-slate-50",
      text: "text-slate-800",
      border: "border-slate-200",
    },
  };

  const item = config[category] || config.other;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.bg} ${item.text} ${item.border} ${className}`}
    >
      {showIcon && item.icon}
      <span>{item.label}</span>
    </span>
  );
}
