"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import { LuSquareCheck, LuLoader, LuLock, LuMail, LuUser } from "react-icons/lu";
import toast from "react-hot-toast";

export default function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { updateUser } = useContext(UserContext);

  const [inviteData, setInviteData] = useState<any>(null);
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Invitation token is missing from URL.");
      return;
    }
    const validateInvite = async () => {
      try {
        const res = await fetch(`/api/invites?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid invitation");
        setInviteData(data);
      } catch (err: any) {
        setError(err.message || "Invalid or expired invitation link");
      } finally {
        setLoading(false);
      }
    };
    validateInvite();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullname.trim()) { setError("Please enter your full name"); return; }
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/invites/accept", { token, name: fullname, password });
      if (response.data?.token) {
        updateUser(response.data);
        toast.success("Account activated! Welcome aboard.");
        router.push("/user/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center gap-3 text-violet-400">
          <LuLoader className="animate-spin h-8 w-8" />
          <span className="text-xs font-medium text-slate-400">Validating invitation link...</span>
        </div>
      </main>
    );
  }

  if (error && !inviteData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-4">
        <div className="glass-card p-8 text-center max-w-sm space-y-4 border border-white/10">
          <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h2 className="text-base font-bold text-white">Invitation Invalid</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button onClick={() => router.push("/login")} className="btn-primary text-xs w-full py-2.5">Go to Login</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19]">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/25 mb-4">
            <LuSquareCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">
            <strong>{inviteData?.inviterName}</strong> invited you as a team worker
          </p>
        </div>

        <div className="glass-card p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleAccept} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Invited Email</label>
              <div className="relative">
             
                <input type="email" disabled value={inviteData?.email || ""} className="form-input pl-10 opacity-60 cursor-not-allowed bg-slate-950/50" />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Your Full Name</label>
              <div className="relative">
          
                <input type="text" placeholder="e.g. Sarah Jenkins" className="form-input pl-10" value={fullname} onChange={(e) => setFullname(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Set Password</label>
              <div className="relative">
        
                <input type="password" placeholder="Min 6 characters" className="form-input pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-xs font-medium text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2 text-xs">
              {submitting ? <><LuLoader className="animate-spin h-4 w-4" /><span>Activating...</span></> : "ACCEPT INVITE & JOIN WORKSPACE"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
