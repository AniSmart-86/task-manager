"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import Modal from "../modals/Modal";
import AvatarGroup from "../AvatarGroup";
import { LuUserPlus } from "react-icons/lu";

interface UserOption {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

interface SelectUsersProps {
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
}

export default function SelectUsers({ selectedUsers = [], setSelectedUsers }: SelectUsersProps) {
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl || "");

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div>
      {selectedUserAvatars.length === 0 ? (
        <button
          type="button"
          className="btn-secondary text-xs w-full py-2 flex items-center justify-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUserPlus className="h-4 w-4 text-violet-400" /> Assign Members
        </button>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2 py-1 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
          <span className="text-xs text-violet-400 font-medium hover:underline">Edit</span>
        </button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Team Members">
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {allUsers.map((user) => {
            const isChecked = tempSelectedUsers.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => toggleUserSelection(user._id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/5 bg-slate-800/40 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4">
          <button type="button" className="btn-secondary text-xs" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn-primary text-xs" onClick={handleAssign}>
            Confirm Assignment
          </button>
        </div>
      </Modal>
    </div>
  );
}
