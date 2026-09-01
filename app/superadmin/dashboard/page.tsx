"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import {
  LuBan,
  LuSquareCheck,
  LuCircleCheck,
  LuLoader,
  LuLogOut,
  LuShieldCheck,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <p className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const { user, clearUser } = useContext(UserContext);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== "superadmin") {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/superadmin/admins");
      setData(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load platform data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAdminStatus = async (admin: any) => {
    const newStatus = admin.status === "suspended" ? "active" : "suspended";
    setActionLoading(admin._id);
    try {
      await axiosInstance.put(`/api/superadmin/admins/${admin._id}`, { status: newStatus });
      toast.success(`Admin ${admin.name} ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update admin status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async (admin: any) => {
    setActionLoading(admin._id);
    try {
      await axiosInstance.delete(`/api/superadmin/admins/${admin._id}`);
      toast.success(`Admin ${admin.name} and their workspace deleted`);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/80 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/20">
              <LuSquareCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">TaskPiloter</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                Super Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LuLogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LuShieldCheck className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Platform Overview</h1>
          </div>
          <p className="text-xs text-slate-400">Oversee all admin workspaces and platform activity</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LuLoader className="animate-spin h-8 w-8 text-violet-400" />
          </div>
        ) : (
          <>
            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Total Admins" value={data?.platformStats?.totalAdmins || 0} color="text-violet-400" />
              <StatCard label="Total Workers" value={data?.platformStats?.totalWorkers || 0} color="text-cyan-400" />
              <StatCard label="Total Tasks" value={data?.platformStats?.totalTasks || 0} color="text-slate-300" />
              <StatCard label="Completed" value={data?.platformStats?.totalCompleted || 0} color="text-emerald-400" />
              <StatCard label="Pending" value={data?.platformStats?.totalPending || 0} color="text-amber-400" />
            </div>

            {/* Admins Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuUsers className="h-4 w-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white">Registered Admins</h2>
                </div>
                <span className="text-xs text-slate-400">{data?.admins?.length || 0} admins</span>
              </div>

              {data?.admins?.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">No admin accounts found</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {data?.admins?.map((admin: any) => (
                    <div key={admin._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-300 font-bold text-sm flex items-center justify-center shrink-0 border border-violet-500/30">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{admin.name}</p>
                          <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-center shrink-0">
                        <div>
                          <p className="text-xs text-slate-400">Workers</p>
                          <p className="text-sm font-bold text-white">{admin.workerCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Tasks</p>
                          <p className="text-sm font-bold text-white">{admin.taskCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Done</p>
                          <p className="text-sm font-bold text-emerald-400">{admin.completedTasks}</p>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            admin.status === "suspended"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {admin.status === "suspended" ? "Suspended" : "Active"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAdminStatus(admin)}
                            disabled={actionLoading === admin._id}
                            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                              admin.status === "suspended"
                                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
                            }`}
                            title={admin.status === "suspended" ? "Reactivate" : "Suspend"}
                          >
                            {actionLoading === admin._id ? (
                              <LuLoader className="animate-spin h-3.5 w-3.5" />
                            ) : admin.status === "suspended" ? (
                              <LuCircleCheck className="h-3.5 w-3.5" />
                            ) : (
                              <LuBan className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(admin)}
                            disabled={actionLoading === admin._id}
                            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Admin & Workspace"
                          >
                            <LuTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-sm space-y-4 border border-white/10 shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <LuTrash2 className="h-5 w-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Admin Workspace</h3>
              <p className="text-xs text-slate-400 mt-2">
                This will permanently delete <strong>{deleteTarget.name}</strong>, all their workers, and all their tasks.
                This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary flex-1 text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(deleteTarget)}
                disabled={actionLoading === deleteTarget._id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {actionLoading === deleteTarget._id ? (
                  <LuLoader className="animate-spin h-3.5 w-3.5" />
                ) : (
                  "Delete Workspace"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
