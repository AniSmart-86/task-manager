"use client";

import React, { useState } from "react";
import { LuPaperclip, LuPlus, LuTrash2 } from "react-icons/lu";

interface AddAttachmentInputProps {
  attachments: string[];
  setAttachments: (value: string[]) => void;
}

export default function AddAttachmentInput({ attachments = [], setAttachments }: AddAttachmentInputProps) {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      {attachments.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2"
        >
          <div className="flex items-center gap-2 text-xs text-slate-200 min-w-0 flex-1 pr-2">
            <LuPaperclip className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="truncate">{item}</span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer p-1"
            onClick={() => handleDeleteOption(index)}
          >
            <LuTrash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <LuPaperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Paste URL or document link..."
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
            className="form-input text-xs pl-9"
          />
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          className="btn-secondary text-xs py-2 px-3 shrink-0"
        >
          <LuPlus className="h-4 w-4" /> Add Link
        </button>
      </div>
    </div>
  );
}
