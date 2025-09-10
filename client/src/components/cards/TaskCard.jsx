import React from "react";
import Progress from "../Progress";
import moment from "moment";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";

const TaskCard = ({
  title = "",
  description = "",
  priority = "Low",
  status = "Pending",
  progress = 0,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  todoChecklists = [],
  onClick,
}) => {
  const getStatusTagColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-400 text-white border border-emerald-500/20";
      case "In_Progress":
        return "bg-cyan-50 text-cyan-500 border border-cyan-500/10";
      default:
        return "bg-violet-50 text-violet-500 border border-violet-500";
    }
  };

  const getPriorityTagColor = (priority) => {
    switch (priority) {
      case "Medium":
        return "bg-amber-50 text-amber-500 border border-amber-500";
      case "Low":
        return "bg-green-100 text-green-500 border border-green-200";
      default:
        return "bg-rose-50 text-rose-500 border border-rose-500/10";
    }
  };




  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      {/* Status + Priority */}
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor(
            status
          )} px-4 py-1 rounded`}
        >
          {status}
        </div>

        <div
          className={`text-[11px] font-medium ${getPriorityTagColor(
            priority
          )} px-4 py-1 rounded`}
        >
          {priority} Priority
        </div>
      </div>

      {/* Task Info */}
      <div
        className={`px-4 border-l-[3px] ${
          status === "In_Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        {/* Checklist Progress */}
        <p className="text-[13px] mt-2 text-gray-700/80 mb-2 line-clamp-2 leading-[18px]">
          Task Done: {" "}
          <span className="font-bold text-gray-700">
            {completedTodoCount}/{todoChecklists?.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      {/* Dates + Footer */}
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {createdAt ? moment(createdAt).format("Do MMM YYYY") : "-"}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {dueDate ? moment(dueDate).format("Do MMM YYYY") : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-2 rounded-lg">
              <LuPaperclip className="text-primary" />
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
