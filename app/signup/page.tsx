"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { validateEmail } from "@/lib/helper";
import { LuSquareCheck, LuLoader, LuLock, LuMail, LuUser } from "react-icons/lu";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullname.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        updateUser(response.data);
        toast.success("Admin workspace created successfully!");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/30 mb-4">
            <LuSquareCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Admin Account</h1>
          <p className="text-xs text-slate-400 mt-1">Set up your workspace to manage tasks & invite workers</p>
        </div>

        <div className="glass-card p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Full Name</label>
              <div className="relative">
            
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  className="form-input pl-10"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Email Address</label>
              <div className="relative">
          
                <input
                  type="email"
                  placeholder="admin@company.com"
                  className="form-input pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Password</label>
              <div className="relative">
            
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

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 text-xs">
              {loading ? (
                <>
                  <LuLoader className="animate-spin h-4 w-4" />
                  <span>Creating Workspace...</span>
                </>
              ) : (
                "CREATE WORKSPACE"
              )}
            </button>

            <div className="pt-4 text-center border-t border-white/5 mt-4">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-400 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
