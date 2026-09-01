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
        className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all group ${
          isSuspended ? "border-rose-200 opacity-80" : "border-slate-200"
        }`}
      >
        {/* Avatar + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-violet-100 text-violet-700 font-bold text-base flex items-center justify-center overflow-hidden shrink-0">
              {userInfo.profileImageUrl ? (
                <img src={userInfo.profileImageUrl} alt={userInfo.name} className="h-full w-full object-cover" />
              ) : (
                <span>{userInfo.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-violet-600 transition-colors">
                {userInfo.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">{userInfo.email}</p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
              isSuspended
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}
          >
            {isSuspended ? "Suspended" : "Active"}
          </span>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 border-t border-slate-100 pt-4">
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-2 text-center">
            <p className="text-[10px] font-semibold text-amber-600 uppercase">Pending</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{userInfo.pendingTasks || 0}</p>
          </div>
          <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-2 text-center">
            <p className="text-[10px] font-semibold text-cyan-600 uppercase">Progress</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{userInfo.inProgressTasks || 0}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-center">
            <p className="text-[10px] font-semibold text-emerald-600 uppercase">Done</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{userInfo.completedTasks || 0}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isSuspended
                ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                : "border-amber-200 text-amber-600 hover:bg-amber-50"
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
            className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Remove Worker"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto">
              <LuTrash2 className="h-5 w-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-800">Remove Worker?</h3>
              <p className="text-xs text-slate-500 mt-2">
                Are you sure you want to remove <strong>{userInfo.name}</strong> from your workspace?
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorker}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
