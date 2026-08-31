"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import TaskStatusTabs from "@/components/TaskStatusTabs";
import TaskCard from "@/components/cards/TaskCard";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";

export default function MyTasksPage() {
  const { refreshTrigger } = useContext(UserContext);
  const router = useRouter();
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = async () => {
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
      console.error("Error fetching user tasks", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [filterStatus, refreshTrigger]);

  const handleCardClick = (taskId: string) => {
    router.push(`/user/task-details/${taskId}`);
  };

  return (
    <AdminDashboardLayout activeMenu="My Tasks">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">My Assigned Tasks</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any task to open details and update progress</p>
          </div>

          {tabs.length > 0 && (
            <TaskStatusTabs tabs={tabs} activeTab={filterStatus} setActiveTab={setFilterStatus} />
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 glass-card animate-pulse" />
            ))}
          </div>
        ) : allTasks.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 text-sm">
            No assigned tasks found under this category.
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
                onClick={() => handleCardClick(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
