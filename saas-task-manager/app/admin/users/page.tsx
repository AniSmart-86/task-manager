"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import UserCard from "@/components/cards/UserCard";
import Modal from "@/components/modals/Modal";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { validateEmail } from "@/lib/helper";
import { LuFileSpreadsheet, LuLoader, LuMail, LuUserPlus } from "react-icons/lu";

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Worker Modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [workerEmail, setWorkerEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");

    if (!validateEmail(workerEmail)) {
      setInviteError("Please enter a valid email address");
      return;
    }

    setSendingInvite(true);
    try {
      const res = await axiosInstance.post("/api/invites", { email: workerEmail });
      toast.success(res.data.message || `Invitation link sent to ${workerEmail}`);
      setWorkerEmail("");
      setIsInviteModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setInviteError(err.message || "Failed to send invitation");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Users report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading user report", error);
      toast.error("Failed to download users report.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminDashboardLayout activeMenu="Team Members">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Team Workers Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">Invite workers via email, assign tasks & manage worker status</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleDownloadReport} className="btn-secondary text-xs">
              <LuFileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="btn-primary text-xs"
            >
              <LuUserPlus className="h-4 w-4" />
              <span>Invite Worker</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 glass-card animate-pulse" />
            ))}
          </div>
        ) : allUsers.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 text-sm">
            <p className="mb-4">No team workers added yet.</p>
            <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary text-xs">
              Invite Your First Worker
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.map((user) => (
              <UserCard key={user._id} userInfo={user} onRefresh={fetchUsers} />
            ))}
          </div>
        )}
      </div>

      {/* Invite Worker Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Worker to Workspace">
        <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
          <p className="text-slate-300">
            Enter the email address of the team member you wish to add as a worker. An invitation email with a registration token link will be sent via <strong>Resend</strong>.
          </p>

          <div>
            <label className="block mb-1.5 font-medium text-slate-300">Worker Email Address</label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="worker@company.com"
                className="form-input pl-10"
                value={workerEmail}
                onChange={(e) => setWorkerEmail(e.target.value)}
              />
            </div>
          </div>

          {inviteError && (
            <p className="text-xs font-medium text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {inviteError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" className="btn-secondary text-xs" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={sendingInvite} className="btn-primary text-xs">
              {sendingInvite ? (
                <>
                  <LuLoader className="animate-spin h-4 w-4" />
                  <span>Sending Email...</span>
                </>
              ) : (
                "Send Email Invitation"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </AdminDashboardLayout>
  );
}
