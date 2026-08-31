"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarChartItem {
  priority: string;
  count: number;
}

interface CustomBarChartProps {
  data: BarChartItem[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function CustomBarChart({ data, colors = DEFAULT_COLORS }: CustomBarChartProps) {
  if (!data || data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-500">
        No priority data available for chart
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="priority"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
