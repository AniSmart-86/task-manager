"use client";

import React from "react";
import moment from "moment";
import { LuCalendar, LuPaperclip, LuSquareCheck } from "react-icons/lu";
import AvatarGroup from "../AvatarGroup";

interface TaskCardProps {
  title: string;
  description?: string;
  priority?: "Low" | "Medium" | "High" | string;
  status?: "Pending" | "In_Progress" | "Completed" | string;
  progress?: number;
  dueDate?: string | Date;
  assignedTo?: any[];
  attachmentCount?: number;
  completedTodoCount?: number;
  todoChecklists?: any[];
  onClick?: () => void;
}

export default function TaskCard({
  title,
  description,
  priority = "Medium",
  status = "Pending",
  progress = 0,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoChecklists = [],
  onClick,
}: TaskCardProps) {
  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In_Progress":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600/30";
    }
  };

  const formattedStatus = status === "In_Progress" ? "In Progress" : status;
  const avatarUrls = assignedTo.map((u) => (typeof u === "string" ? u : u?.profileImageUrl));
  const totalTodos = todoChecklists.length;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 cursor-pointer"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getPriorityStyle(priority)}`}>
            {priority}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusStyle(status)}`}>
            {formattedStatus}
          </span>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
          {title}
        </h4>
        {description && <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{description}</p>}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span>Progress</span>
            <span className="text-slate-200">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Meta Info */}
      <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
        <AvatarGroup avatars={avatarUrls} maxVisible={3} />

        <div className="flex items-center gap-3 text-xs text-slate-400">
          {totalTodos > 0 && (
            <div className="flex items-center gap-1">
              <LuSquareCheck className="h-3.5 w-3.5 text-violet-400" />
              <span>
                {completedTodoCount}/{totalTodos}
              </span>
            </div>
          )}

          {attachmentCount > 0 && (
            <div className="flex items-center gap-1">
              <LuPaperclip className="h-3.5 w-3.5 text-cyan-400" />
              <span>{attachmentCount}</span>
            </div>
          )}

          {dueDate && (
            <div className="flex items-center gap-1 text-[11px]">
              <LuCalendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{moment(dueDate).format("MMM D")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
