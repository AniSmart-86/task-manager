"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PieChartItem {
  status: string;
  count: number;
}

interface CustomPieChartProps {
  data: PieChartItem[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#8b5cf6", "#06b6d4", "#10b981"];

export default function CustomPieChart({ data, colors = DEFAULT_COLORS }: CustomPieChartProps) {
  if (!data || data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-500">
        No task data available for chart
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    displayName: item.status === "In_Progress" ? "In Progress" : item.status,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
            nameKey="displayName"
          >
            {formattedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="rgba(15,23,42,0.8)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.75rem",
              color: "#fff",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
