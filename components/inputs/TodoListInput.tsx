"use client";

import React, { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";

interface TodoListInputProps {
  todoList: string[];
  setTodoList: (value: string[]) => void;
}

export default function TodoListInput({ todoList = [], setTodoList }: TodoListInputProps) {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setTodoList(todoList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      {todoList.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2"
        >
          <p className="text-xs text-slate-200 flex items-center gap-2">
            <span className="font-mono text-[11px] text-violet-400 font-semibold">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            <span>{item}</span>
          </p>
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
        <input
          type="text"
          placeholder="Enter todo item..."
          value={option}
          onChange={(e) => setOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
          className="form-input text-xs"
        />
        <button
          type="button"
          onClick={handleAddOption}
          className="btn-secondary text-xs py-2 px-3 shrink-0"
        >
          <LuPlus className="h-4 w-4" /> Add
        </button>
      </div>
    </div>
  );
}
