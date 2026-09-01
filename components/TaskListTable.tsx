"use client";

import React from "react";
import moment from "moment";

interface TaskTableItem {
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdAt?: string;
  dueDate?: string;
}

interface TaskListTableProps {
  tableData: TaskTableItem[];
}

export default function TaskListTable({ tableData }: TaskListTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In_Progress":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  if (!tableData || tableData.length === 0) {
    return <div className="p-6 text-center text-xs text-slate-500">No tasks created yet</div>;
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <table className="w-full text-left text-xs min-w-[340px]">
        <thead>
          <tr className="border-b border-white/5 text-slate-400 uppercase tracking-wider text-[9px] sm:text-[10px] font-semibold">
            <th className="py-2.5 px-2 sm:px-4">Task Name</th>
            <th className="py-2.5 px-2 sm:px-4">Status</th>
            <th className="py-2.5 px-2 sm:px-4">Priority</th>
            <th className="py-2.5 px-2 sm:px-4 hidden md:table-cell">Created On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tableData.map((task) => (
            <tr key={task._id} className="hover:bg-white/2 transition-colors">
              <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 font-medium text-slate-200 line-clamp-1 max-w-[140px] sm:max-w-xs text-xs">
                {task.title}
              </td>
              <td className="py-2.5 sm:py-3.5 px-2 sm:px-4">
                <span className={`inline-block border px-2 py-0.5 rounded-full font-medium text-[10px] sm:text-[11px] whitespace-nowrap ${getStatusBadge(task.status)}`}>
                  {task.status === "In_Progress" ? "In Progress" : task.status}
                </span>
              </td>
              <td className="py-2.5 sm:py-3.5 px-2 sm:px-4">
                <span className={`inline-block border px-2 py-0.5 rounded-full font-medium text-[10px] sm:text-[11px] whitespace-nowrap ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-slate-400 hidden md:table-cell">
                {task.createdAt ? moment(task.createdAt).format("Do MMM YYYY") : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
