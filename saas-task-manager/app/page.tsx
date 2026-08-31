"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import {
  LuArrowRight,
  LuBan,
  LuSquareCheck,
  LuClock,
  LuFileSpreadsheet,
  LuLayoutDashboard,
  LuLock,
  LuMail,
  LuShieldCheck,
  LuTrendingUp,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";

export default function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-25 bg-linear-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <LuSquareCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Taskify SaaS</span>
              <span className="text-[10px] uppercase font-semibold text-violet-400 block -mt-1">
                Task Management
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-violet-400 transition-colors">Workflow</a>
            <a href="#monitoring" className="hover:text-violet-400 transition-colors">Live Progress</a>
            <a href="#reports" className="hover:text-violet-400 transition-colors">Reports</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                className="btn-primary text-xs"
              >
                <LuLayoutDashboard className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-xs px-4">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-xs">
                  <span>Create Workspace</span>
                  <LuArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6 shadow-lg shadow-violet-500/10 animate-pulse">
          <LuShieldCheck className="h-4 w-4 text-violet-400" />
          <span>Automatic Admin Signup & Email Invitations</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Streamline Workflows, Empower Workers &{" "}
          <span className="bg-linear-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Track Progress Real-Time
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Create your admin workspace in seconds. Invite team workers directly via emails, assign tasks with automated checklist tracking, manage worker access, and export Excel reports.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary text-sm px-8 py-3.5 w-full sm:w-auto">
            <span>Get Started as Admin</span>
            <LuArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="btn-secondary text-sm px-8 py-3.5 w-full sm:w-auto">
            <span>Sign In to Existing Account</span>
          </Link>
        </div>

        {/* Live Interactive Dashboard Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto glass-card p-6 md:p-8 shadow-2xl border border-white/10 relative text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-semibold text-slate-400">Taskify SaaS Admin Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Synchronization
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Tasks</span>
              <p className="text-2xl font-bold text-white mt-1">128</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <span className="text-[11px] text-amber-400 uppercase font-semibold">Pending</span>
              <p className="text-2xl font-bold text-white mt-1">18</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <span className="text-[11px] text-cyan-400 uppercase font-semibold">In Progress</span>
              <p className="text-2xl font-bold text-white mt-1">42</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">
              <span className="text-[11px] text-emerald-400 uppercase font-semibold">Completed</span>
              <p className="text-2xl font-bold text-white mt-1">68</p>
            </div>
          </div>

          {/* Sample Task Row */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  High Priority
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  In Progress
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">Deploy Production API Server & Resend Webhooks</h4>
              <p className="text-xs text-slate-400">Assigned to: Alex Morgan, Sarah Jenkins</p>
            </div>

            <div className="w-full md:w-48">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1">
                <span>Completion</span>
                <span className="text-violet-400">80%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-linear-to-r from-violet-500 to-cyan-400 w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">Built for Modern Team Managers</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to lead workers and deliver projects on time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <LuUserPlus className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Auto Admin Setup</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone registering on Taskify is instantly created as an Admin workspace manager with full operational control.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <LuMail className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Resend Worker Invites</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invite team members by email. Workers receive styled tokenized links via Resend to activate their accounts and set passwords.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <LuTrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Real-Time Progress Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor task completion percentages, interactive checklist check-offs, status shifts, and resource links in real-time.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <LuBan className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Worker Access Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain workspace integrity. Suspend worker accounts to block login access, reactivate active workers, or delete members.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <LuFileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Formatted Excel Exports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate and download detailed Excel spreadsheets for task distributions, member task assignments, and progress metrics.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <LuLock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Server & Client Admin Proxy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next.js middleware proxy guards administrative routes on both server and client levels to prevent unauthorized access.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white">How Taskify SaaS Works</h2>
          <p className="text-sm text-slate-400 mt-2">Get up and running in 3 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="glass-card p-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-violet-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-violet-600/30">
              1
            </div>
            <h3 className="text-base font-semibold text-white">Create Admin Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Register as an Admin manager. No complex setup or invite codes needed—your workspace is created instantly.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-cyan-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-cyan-600/30">
              2
            </div>
            <h3 className="text-base font-semibold text-white">Invite Workers via Email</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter team emails in Team Members directory. Resend dispatches invitation tokens for workers to set up passwords.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
              3
            </div>
            <h3 className="text-base font-semibold text-white">Assign & Monitor Progress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assign tasks to workers, track interactive checklist completion percentages, and review real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden bg-linear-to-r from-violet-900/40 via-indigo-900/40 to-slate-900/80 border border-violet-500/30">
          <h2 className="text-3xl font-extrabold text-white">Ready to Boost Team Productivity?</h2>
          <p className="text-xs md:text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Join workspace managers who rely on Taskify SaaS to organize tasks, invite workers, and deliver work on time.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup" className="btn-primary text-xs px-8 py-3">
              <span>Create Free Admin Workspace</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LuSquareCheck className="h-4 w-4 text-violet-400" />
            <span className="font-bold text-white">Taskify SaaS</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-slate-300 transition-colors">Create Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
