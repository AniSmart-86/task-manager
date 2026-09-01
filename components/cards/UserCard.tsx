"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { LuBan, LuCircleCheck, LuLoader, LuTrash2 } from "react-icons/lu";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  status?: "active" | "suspended" | string;
  pendingTasks?: number;
  inProgressTasks?: number;
  completedTasks?: number;
}

interface UserCardProps {
  userInfo: UserInfo;
  onRefresh?: () => void;
}

export default function UserCard({ userInfo, onRefresh }: UserCardProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(userInfo.status || "active");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isSuspended = currentStatus === "suspended";

  const handleToggleStatus = async () => {
    const newStatus = isSuspended ? "active" : "suspended";
    setLoading(true);
    try {
      await axiosInstance.put(`/api/users/${userInfo._id}`, { status: newStatus });
      setCurrentStatus(newStatus);
      toast.success(`${userInfo.name} ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update worker status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorker = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/users/${userInfo._id}`);
      toast.success(`${userInfo.name} removed from workspace`);
      setShowDeleteModal(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete worker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`glass-card p-5 relative overflow-hidden group transition-all ${
          isSuspended ? "opacity-75 border-rose-500/20" : ""
        }`}
      >
        {/* Avatar + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold text-base overflow-hidden shrink-0">
              {userInfo.profileImageUrl ? (
                <img src={userInfo.profileImageUrl} alt={userInfo.name} className="h-full w-full object-cover" />
              ) : (
                <span>{userInfo.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                {userInfo.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">{userInfo.email}</p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
              isSuspended
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            {isSuspended ? "Suspended" : "Active"}
          </span>
        </div>

        {/* Task Performance Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 border-t border-white/5 pt-4">
          <div className="rounded-xl bg-slate-950/40 p-2 text-center border border-white/5">
            <p className="text-[10px] uppercase font-semibold text-amber-400">Pending</p>
            <p className="text-sm font-bold text-white mt-0.5">{userInfo.pendingTasks || 0}</p>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-2 text-center border border-white/5">
            <p className="text-[10px] uppercase font-semibold text-cyan-400">Progress</p>
            <p className="text-sm font-bold text-white mt-0.5">{userInfo.inProgressTasks || 0}</p>
          </div>
          <div className="rounded-xl bg-slate-950/40 p-2 text-center border border-white/5">
            <p className="text-[10px] uppercase font-semibold text-emerald-400">Done</p>
            <p className="text-sm font-bold text-white mt-0.5">{userInfo.completedTasks || 0}</p>
          </div>
        </div>

        {/* Action Buttons: Suspend & Delete */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
          <button
            type="button"
            disabled={loading}
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isSuspended
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
            }`}
          >
            {loading ? (
              <LuLoader className="animate-spin h-3.5 w-3.5" />
            ) : isSuspended ? (
              <><LuCircleCheck className="h-3.5 w-3.5" /> Reactivate</>
            ) : (
              <><LuBan className="h-3.5 w-3.5" /> Suspend</>
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer border border-rose-500/20"
            title="Remove Worker"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card p-6 w-full max-w-sm space-y-4 border border-white/10 shadow-2xl">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <LuTrash2 className="h-5 w-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Remove Worker?</h3>
              <p className="text-xs text-slate-400 mt-2">
                Are you sure you want to remove <strong>{userInfo.name}</strong> from your workspace?
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="btn-secondary flex-1 text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorker}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? <LuLoader className="animate-spin h-3.5 w-3.5" /> : "Remove Worker"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
