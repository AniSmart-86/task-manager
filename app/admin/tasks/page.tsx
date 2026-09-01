"use client";

import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import TaskStatusTabs from "@/components/TaskStatusTabs";
import TaskCard from "@/components/cards/TaskCard";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { LuFileSpreadsheet, LuPlus } from "react-icons/lu";

export default function AdminTasksPage() {
  const { handleClick, setOpenCreateTaskModal, refreshTrigger } = useContext(UserContext);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      const tasks = response.data?.tasks || [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};
      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In_Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tasks report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading task report", error);
      toast.error("Failed to download tasks report.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, refreshTrigger]);

  return (
    <AdminDashboardLayout activeMenu="Manage Tasks">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Task Management Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter, inspect, edit, or export task reports</p>
          </div>


          <div className="flex items-center gap-2">
            <button type="button" onClick={handleDownloadReport} className="btn-secondary text-xs">
              <LuFileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span className="">Export Excel</span>
            </button>

            <button type="button" onClick={() => setOpenCreateTaskModal(true)} className="btn-primary text-xs">
              <LuPlus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        {tabs.length > 0 && (
          <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
        )}

        {/* Task Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 glass-card animate-pulse" />
            ))}
          </div>
        ) : allTasks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-sm font-medium text-slate-400">No tasks found matching this filter.</p>
            <button
              onClick={() => setOpenCreateTaskModal(true)}
              className="btn-primary text-xs mt-4"
            >
              Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTasks.map((task) => (
              <TaskCard
                key={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                progress={task.progress}
                dueDate={task.dueDate}
                assignedTo={Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]}
                attachmentCount={task.attachments?.length || 0}
                completedTodoCount={task.completedTodoCount || 0}
                todoChecklists={task.todoChecklists || []}
                onClick={() => handleClick(task)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
