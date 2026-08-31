"use client";

import React from "react";

interface AvatarGroupProps {
  avatars?: string[];
  maxVisible?: number;
}

export default function AvatarGroup({ avatars = [], maxVisible = 4 }: AvatarGroupProps) {
  if (!avatars || avatars.length === 0) {
    return (
      <div className="flex items-center text-xs text-slate-400">
        <span>Unassigned</span>
      </div>
    );
  }

  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden">
      {visibleAvatars.map((url, idx) => (
        <div
          key={idx}
          className=" h-7 w-7 rounded-full ring-2 ring-slate-900 overflow-hidden bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center"
        >
          {url ? (
            <img src={url} alt={`Member ${idx + 1}`} className="h-full w-full object-cover" />
          ) : (
            <span>U{idx + 1}</span>
          )}
        </div>
      ))}
      {extraCount > 0 && (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-medium text-slate-300 ring-2 ring-slate-900">
          +{extraCount}
        </div>
      )}
    </div>
  );
}
