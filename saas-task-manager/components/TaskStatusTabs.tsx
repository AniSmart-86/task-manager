"use client";

import React from "react";

interface TabItem {
  label: string;
  count: number;
}

interface TaskStatusTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TaskStatusTabs({ tabs, activeTab, setActiveTab }: TaskStatusTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-900/80 p-1 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;
        const displayLabel = tab.label === "In_Progress" ? "In Progress" : tab.label;

        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <span>{displayLabel}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
