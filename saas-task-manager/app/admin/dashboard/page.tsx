"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { UserContext } from "@/context/UserContext";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import InfoCard from "@/components/cards/InfoCard";
import CustomPieChart from "@/components/charts/CustomPieChart";
import CustomBarChart from "@/components/charts/CustomBarChart";
import TaskListTable from "@/components/TaskListTable";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { addThousandsSeparator } from "@/lib/helper";
import { LuArrowRight, LuPlus } from "react-icons/lu";

const CHART_COLORS = ["#8b5cf6", "#06b6d4", "#10b981"];

export default function AdminDashboardPage() {
  const { user, setOpenCreateTaskModal, refreshTrigger } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);

  const prepareChartData = (data: any) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevel = data?.taskPriorityLevel || {};

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In_Progress", count: taskDistribution.In_Progress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ]);

    setBarChartData([
      { priority: "Low", count: taskPriorityLevel.Low || 0 },
      { priority: "Medium", count: taskPriorityLevel.Medium || 0 },
      { priority: "High", count: taskPriorityLevel.High || 0 },
    ]);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 16) greeting = "Good Afternoon";

  return (
    <AdminDashboardLayout activeMenu="Dashboard">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {greeting}, {user?.name || "Admin"} 👋
            </h2>
            <p className="text-xs text-slate-400 mt-1">{moment().format("dddd, Do MMMM YYYY")}</p>
          </div>

          <button
            type="button"
            onClick={() => setOpenCreateTaskModal(true)}
            className="btn-primary text-xs"
          >
            <LuPlus className="h-4 w-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
          />
          <InfoCard
            label="In Progress"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.In_Progress || 0)}
          />
          <InfoCard
            label="Completed"
            value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Status Breakdown</h3>
              <span className="text-[11px] text-slate-400 font-medium">Distribution by State</span>
            </div>
            <CustomPieChart data={pieChartData} colors={CHART_COLORS} />
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Priority Distribution</h3>
              <span className="text-[11px] text-slate-400 font-medium">Distribution by Level</span>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Recent Work Activity</h3>
              <p className="text-xs text-slate-400">Latest 10 tasks created across all teams</p>
            </div>
            <Link
              href="/admin/tasks"
              className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
            >
              <span>Manage Tasks</span>
              <LuArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
