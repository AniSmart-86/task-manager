"use client";

import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

interface DeleteAlertProps {
  content: string;
  onDelete: () => void;
  onClose?: () => void;
}

export default function DeleteAlert({ content, onDelete, onClose }: DeleteAlertProps) {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-3 text-amber-400">
        <LuTriangleAlert className="h-6 w-6 shrink-0" />
        <p className="text-sm text-slate-200">{content}</p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        {onClose && (
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/30 cursor-pointer"
        >
          Delete Permanently
        </button>
      </div>
    </div>
  );
}
