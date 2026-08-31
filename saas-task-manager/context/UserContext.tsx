"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  profileImageUrl?: string;
  token?: string;
}

export interface UserContextType {
  user: UserType | null;
  loading: boolean;
  updateUser: (userData: UserType & { token?: string }) => void;
  clearUser: () => void;
  openCreateTaskModal: boolean;
  setOpenCreateTaskModal: (open: boolean) => void;
  editingTask: any | null;
  setEditingTask: (task: any | null) => void;
  handleClick: (taskData: any) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
  openCreateTaskModal: false,
  setOpenCreateTaskModal: () => {},
  editingTask: null,
  setEditingTask: () => {},
  handleClick: () => {},
  refreshTrigger: 0,
  triggerRefresh: () => {},
});

const setAuthCookies = (token?: string, role?: string) => {
  if (typeof document === "undefined") return;
  if (token) {
    document.cookie = `taskManagerToken=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
  if (role) {
    document.cookie = `taskManagerRole=${role}; path=/; max-age=86400; SameSite=Lax`;
  }
};

const clearAuthCookies = () => {
  if (typeof document === "undefined") return;
  document.cookie = "taskManagerToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "taskManagerRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("taskManagerToken") || localStorage.getItem("token");
    if (!token) {
      clearAuthCookies();
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      if (response.data) {
        setUser(response.data);
        setAuthCookies(token, response.data.role);
      }
    } catch (error) {
      console.error("User not authenticated", error);
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = (userData: UserType & { token?: string }) => {
    setUser(userData);
    const tokenToStore = userData.token || localStorage.getItem("taskManagerToken") || localStorage.getItem("token") || "";
    if (tokenToStore) {
      localStorage.setItem("taskManagerToken", tokenToStore);
      localStorage.setItem("token", tokenToStore);
      setAuthCookies(tokenToStore, userData.role);
    }
    if (userData) {
      localStorage.setItem("taskManagerUser", JSON.stringify(userData));
    }
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("taskManagerToken");
    localStorage.removeItem("token");
    localStorage.removeItem("taskManagerUser");
    clearAuthCookies();
  };

  const handleClick = (taskData: any) => {
    setEditingTask(taskData);
    setOpenCreateTaskModal(true);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        clearUser,
        openCreateTaskModal,
        setOpenCreateTaskModal,
        editingTask,
        setEditingTask,
        handleClick,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
