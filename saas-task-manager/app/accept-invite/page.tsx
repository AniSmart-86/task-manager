"use client";

import React, { Suspense, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import { LuSquareCheck, LuLoader, LuLock, LuMail, LuUser } from "react-icons/lu";
import toast from "react-hot-toast";

function AcceptInviteForm() {
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

  const validateInvite = async (inviteToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invites?token=${inviteToken}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid invitation token");
      }
      setInviteData(data);
    } catch (err: any) {
      setError(err.message || "Invalid or expired invitation link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      validateInvite(token);
    } else {
      setLoading(false);
      setError("Invitation token is missing from URL.");
    }
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullname.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/invites/accept", {
        token,
        name: fullname,
        password,
      });

      if (response.data?.token) {
        updateUser(response.data);
        toast.success("Work account activated successfully!");
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
      <div className="flex flex-col items-center gap-3 text-violet-400">
        <LuLoader className="animate-spin h-8 w-8 text-violet-500" />
        <span className="text-xs font-medium tracking-wide">Validating invitation link...</span>
      </div>
    );
  }

  if (error && !inviteData) {
    return (
      <div className="glass-card p-8 text-center max-w-md space-y-4">
        <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h2 className="text-lg font-bold text-white">Invitation Link Invalid</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={() => router.push("/login")} className="btn-primary text-xs w-full py-2.5">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/30 mb-4">
          <LuSquareCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Join Workspace</h1>
        <p className="text-xs text-slate-400 mt-1">
          <strong>{inviteData?.inviterName}</strong> invited you to join their team as a worker
        </p>
      </div>

      <div className="glass-card p-8 shadow-2xl border border-white/10">
        <form onSubmit={handleAccept} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-medium text-slate-300">Invited Email</label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                disabled
                value={inviteData?.email || ""}
                className="form-input pl-10 opacity-70 cursor-not-allowed bg-slate-900/40"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-slate-300">Your Full Name</label>
            <div className="relative">
              <LuUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                className="form-input pl-10"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-medium text-slate-300">Set Account Password</label>
            <div className="relative">
              <LuLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Min 6 characters"
                className="form-input pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2 text-xs">
            {submitting ? (
              <>
                <LuLoader className="animate-spin h-4 w-4" />
                <span>Activating Account...</span>
              </>
            ) : (
              "ACCEPT INVITE & JOIN WORKSPACE"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-violet-400">
            <LuLoader className="animate-spin h-8 w-8 text-violet-500" />
            <span className="text-xs font-medium tracking-wide">Loading...</span>
          </div>
        }
      >
        <AcceptInviteForm />
      </Suspense>
    </main>
  );
}
