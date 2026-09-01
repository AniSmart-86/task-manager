"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { validateEmail } from "@/lib/helper";
import { LuLoader, LuLock, LuMail, LuSquareCheck } from "react-icons/lu";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        updateUser(response.data);
        toast.success("Welcome back!");
        if (role === "superadmin") {
          router.push("/superadmin/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/30 mb-4">
            <LuSquareCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">TaskPiloter</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your task workspace</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Email Address</label>
              <div className="relative">
                {/* <LuMail className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-input "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-slate-300">Password</label>
              <div className="relative ">
                {/* <LuLock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input "
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
                  <span>Signing in...</span>
                </>
              ) : (
                "SIGN IN"
              )}
            </button>

            <div className="pt-4 text-center border-t border-white/5 mt-4">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-violet-400 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
