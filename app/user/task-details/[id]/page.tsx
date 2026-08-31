"use client";

import React, { use, useContext, useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import toast from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import AvatarGroup from "@/components/AvatarGroup";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { LuArrowLeft, LuExternalLink, LuPaperclip, LuPencil } from "react-icons/lu";

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const { user, handleClick, refreshTrigger } = useContext(UserContext);

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    setUpdatingStatus(true);
    try {
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(taskId), {
        status: newStatus,
      });

      if (response.data?.task) {
        setTask(response.data.task);
      } else {
        setTask((prev: any) => ({ ...prev, status: newStatus }));
      }
      toast.success("Task status updated!");
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const toggleChecklist = async (index: number) => {
    if (!task) return;
    const updatedChecklist = [...(task.todoChecklists || [])];
    if (!updatedChecklist[index]) return;

    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
        todoChecklists: updatedChecklist,
      });

      if (response.data?.task) {
        setTask(response.data.task);
      } else {
        setTask((prev: any) => ({ ...prev, todoChecklists: updatedChecklist }));
      }
      toast.success("Checklist updated!");
    } catch (error) {
      console.error("Error updating checklist", error);
      toast.error("Failed to update checklist");
      updatedChecklist[index].completed = !updatedChecklist[index].completed;
      setTask((prev: any) => ({ ...prev, todoChecklists: updatedChecklist }));
    }
  };

  const handleLinkClick = (url: string) => {
    let formatted = url;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }
    window.open(formatted, "_blank");
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId, refreshTrigger]);

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

  return (
    <AdminDashboardLayout activeMenu="Task Details">
      <div className="space-y-6">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href={user?.role === "admin" ? "/admin/tasks" : "/user/my-tasks"}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <LuArrowLeft className="h-4 w-4" />
            <span>Back to Tasks</span>
          </Link>

          {user?.role === "admin" && task && (
            <button
              onClick={() => handleClick(task)}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <LuPencil className="h-3.5 w-3.5" />
              <span>Edit Task</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="h-96 glass-card animate-pulse" />
        ) : !task ? (
          <div className="glass-card p-12 text-center text-slate-400 text-sm">
            Task not found or unavailable.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details & Checklist */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <h2 className="text-xl font-bold text-white tracking-tight">{task.title}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${getPriorityBadge(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <select
                      value={task.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`px-3 py-1 rounded-full border text-xs font-semibold cursor-pointer bg-slate-900 outline-none ${getStatusBadge(task.status)}`}
                    >
                      <option value="Pending" className="bg-slate-900 text-amber-400">Pending</option>
                      <option value="In_Progress" className="bg-slate-900 text-cyan-400">In Progress</option>
                      <option value="Completed" className="bg-slate-900 text-emerald-400">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Task Completion Progress</span>
                    <span className="font-semibold text-white">{task.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">Description</h4>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-white/5">
                    {task.description || "No description provided."}
                  </p>
                </div>

                {/* Todo Checklist */}
                <div className="mt-6">
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">
                    Todo Checklist ({task.todoChecklists?.filter((t: any) => t.completed).length || 0}/
                    {task.todoChecklists?.length || 0})
                  </h4>

                  {!task.todoChecklists || task.todoChecklists.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No checklist items set for this task.</p>
                  ) : (
                    <div className="space-y-2">
                      {task.todoChecklists.map((item: any, index: number) => (
                        <div
                          key={`todo-${index}`}
                          onClick={() => toggleChecklist(index)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            item.completed
                              ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400 line-through"
                              : "bg-slate-800/40 border-white/5 text-slate-100 hover:bg-slate-800/80"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => {}}
                            className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                          />
                          <span className="text-xs font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Meta Info & Attachments */}
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-3">Task Meta</h3>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">Due Date</span>
                  <p className="text-xs font-medium text-slate-200">
                    {task.dueDate ? moment(task.dueDate).format("dddd, Do MMMM YYYY") : "No due date set"}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-2">Assigned Members</span>
                  <AvatarGroup
                    avatars={(task.assignedTo || []).map((u: any) => u.profileImageUrl || "")}
                    maxVisible={5}
                  />
                  <div className="mt-2 space-y-1">
                    {(task.assignedTo || []).map((u: any, i: number) => (
                      <p key={i} className="text-xs text-slate-300">
                        {u.name} <span className="text-[10px] text-slate-500">({u.email})</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">Created At</span>
                  <p className="text-xs text-slate-400">
                    {task.createdAt ? moment(task.createdAt).format("Do MMM YYYY, h:mm a") : "N/A"}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-3 mb-3">
                    Attachments & Links ({task.attachments.length})
                  </h3>

                  <div className="space-y-2">
                    {task.attachments.map((link: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => handleLinkClick(link)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-white/5 hover:border-violet-500/40 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                          <LuPaperclip className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="text-xs text-slate-300 truncate group-hover:text-violet-300">
                            {link}
                          </span>
                        </div>
                        <LuExternalLink className="h-4 w-4 text-slate-400 group-hover:text-violet-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
