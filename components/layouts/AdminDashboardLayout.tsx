"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { SIDE_BAR_DATA, USER_SIDE_BAR_DATA } from "@/lib/data";
import { LuLoader, LuLogOut, LuMenu, LuPlus, LuShieldAlert, LuSquareCheck, LuUser, LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import CreateTaskModal from "../modals/CreateTaskModal";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  activeMenu?: string;
}

export default function AdminDashboardLayout({ children, activeMenu }: AdminDashboardLayoutProps) {
  const { user, loading, clearUser, openCreateTaskModal, setOpenCreateTaskModal } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Please sign in to access workspace");
        router.replace("/login");
      } else if (isAdminRoute && user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.replace("/user/dashboard");
      }
    }
  }, [user, loading, isAdminRoute, router]);

  const sidebarItems = user?.role === "admin" ? SIDE_BAR_DATA : USER_SIDE_BAR_DATA;

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100">
        <div className="flex flex-col items-center gap-3 text-violet-400">
          <LuLoader className="animate-spin h-8 w-8 text-violet-500" />
          <span className="text-xs font-medium tracking-wide">Validating session permissions...</span>
        </div>
      </div>
    );
  }

  if (isAdminRoute && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-100 p-4">
        <div className="glass-card p-8 text-center max-w-md space-y-4">
          <LuShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Access Denied</h3>
          <p className="text-xs text-slate-400">
            You do not have administrator permissions to view this section.
          </p>
          <button
            onClick={() => router.replace("/user/dashboard")}
            className="btn-primary text-xs w-full py-2.5"
          >
            Go to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-slate-100 bg-[#030712]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl p-5 justify-between">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <LuSquareCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">TaskPiloter</h1>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-violet-400">
                {user?.role === "admin" ? "Admin Portal" : "Workspace"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || activeMenu === item.label;
              const isLogout = item.label === "Logout";

              if (isLogout) {
                return (
                  <button
                    key={item.id}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 cursor-pointer mt-6"
                  >
                    <LuLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-md shadow-violet-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-violet-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card Info at sidebar bottom */}
        {user && (
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3 flex items-center gap-3 backdrop-blur-md">
            <div className="h-9 w-9 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <LuUser className="h-4 w-4 text-violet-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-950 p-5 flex flex-col justify-between border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                    <LuSquareCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-white text-sm">Taskify</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <LuX className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path || activeMenu === item.label;
                  if (item.label === "Logout") {
                    return (
                      <button
                        key={item.id}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10"
                      >
                        <LuLogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                        isActive ? "bg-violet-600 text-white" : "text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {user && (
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-white/10 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
            >
              <LuMenu className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{activeMenu || "Dashboard"}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => setOpenCreateTaskModal(true)}
                className="btn-primary text-xs"
              >
                <LuPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-rose-500/30 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LuLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Create / Edit Task Modal */}
      <CreateTaskModal isOpen={openCreateTaskModal} onClose={() => setOpenCreateTaskModal(false)} />
    </div>
  );
}
