"use client";

import React from "react";
import { LuCircleCheck, LuClock, LuListTodo, LuTrendingUp } from "react-icons/lu";

interface InfoCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function InfoCard({ label, value }: InfoCardProps) {
  let icon = <LuListTodo className="h-5 w-5 text-violet-400" />;
  let accentGradient = "from-violet-500/20 to-purple-500/5";
  let borderAccent = "group-hover:border-violet-500/40";

  if (label.includes("Pending")) {
    icon = <LuClock className="h-5 w-5 text-amber-400" />;
    accentGradient = "from-amber-500/20 to-orange-500/5";
    borderAccent = "group-hover:border-amber-500/40";
  } else if (label.includes("Progress")) {
    icon = <LuTrendingUp className="h-5 w-5 text-cyan-400" />;
    accentGradient = "from-cyan-500/20 to-blue-500/5";
    borderAccent = "group-hover:border-cyan-500/40";
  } else if (label.includes("Completed")) {
    icon = <LuCircleCheck className="h-5 w-5 text-emerald-400" />;
    accentGradient = "from-emerald-500/20 to-teal-500/5";
    borderAccent = "group-hover:border-emerald-500/40";
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${borderAccent}`}
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-linear-to-br ${accentGradient} blur-xl`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <div className="rounded-xl border border-white/10 bg-slate-800/80 p-2 backdrop-blur-md">{icon}</div>
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
      </div>
    </div>
  );
}
