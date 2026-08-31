"use client";

import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SelectDropdown({ options, value, onChange, placeholder }: SelectDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-input text-slate-200 cursor-pointer bg-slate-900"
    >
      {placeholder && (
        <option value="" disabled className="bg-slate-900 text-slate-400">
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
