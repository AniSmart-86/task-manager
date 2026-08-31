"use client";

import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { LuLoader, LuTrash2, LuX } from "react-icons/lu";
import { UserContext } from "@/context/UserContext";
import axiosInstance from "@/lib/axiosInstance";
import { API_PATHS } from "@/lib/apiPaths";
import { PRIORITY_DATA } from "@/lib/data";
import SelectDropdown from "../inputs/SelectDropdown";
import TodoListInput from "../inputs/TodoListInput";
import AddAttachmentInput from "../inputs/AddAttachmentInput";
import SelectUsers from "../inputs/SelectUsers";
import Modal from "./Modal";
import DeleteAlert from "./DeleteAlert";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const { editingTask, setEditingTask, triggerRefresh } = useContext(UserContext);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [] as string[],
    todoChecklists: [] as string[],
    attachments: [] as string[],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key: string, value: any) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklists: [],
      attachments: [],
    });
    setEditingTask(null);
    setError("");
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklists.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklists: todolist,
      });

      toast.success("Task created successfully!");
      triggerRefresh();
      if (onSuccess) onSuccess();
      clearData();
      onClose();
    } catch (err: any) {
      console.error("Error creating task", err);
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTask?._id) return;
    setLoading(true);

    try {
      const todolist = taskData.todoChecklists.map((item) => {
        const matched = (editingTask.todoChecklists || []).find((t: any) => t.text === item);
        return {
          text: item,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(editingTask._id), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklists: todolist,
      });

      toast.success("Task updated successfully!");
      triggerRefresh();
      if (onSuccess) onSuccess();
      clearData();
      onClose();
    } catch (err: any) {
      console.error("Error updating task", err);
      setError(err.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingTask?._id) return;
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(editingTask._id));
      toast.success("Task deleted");
      setOpenDeleteAlert(false);
      triggerRefresh();
      if (onSuccess) onSuccess();
      clearData();
      onClose();
    } catch (err: any) {
      console.error("Error deleting task", err);
      toast.error("Failed to delete task");
    }
  };

  const handleSubmit = () => {
    setError("");
    if (!taskData.title.trim()) return setError("Task title is required");
    if (!taskData.description.trim()) return setError("Description is required");
    if (!taskData.dueDate) return setError("Due date is required");
    if (taskData.assignedTo.length === 0) return setError("Assign to at least one member");
    if (taskData.todoChecklists.length === 0) return setError("Add at least one checklist item");

    if (editingTask) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  useEffect(() => {
    if (editingTask) {
      setTaskData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "Low",
        attachments: editingTask.attachments || [],
        assignedTo: (editingTask.assignedTo || []).map((u: any) => (typeof u === "string" ? u : u._id)),
        todoChecklists: (editingTask.todoChecklists || []).map((item: any) => item.text || item),
        dueDate: editingTask.dueDate ? moment(editingTask.dueDate).format("YYYY-MM-DD") : "",
      });
    } else {
      clearData();
    }
  }, [editingTask]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingTask ? "Update Task Details" : "Create New Task"}
            </h3>

            <div className="flex items-center gap-2">
              {editingTask && (
                <button
                  type="button"
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                >
                  <LuTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  clearData();
                  onClose();
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-slate-300">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Design Landing Page Wireframes"
                className="form-input"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-slate-300">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed explanation of task requirements..."
                className="form-input resize-none"
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
              />
            </div>

            {/* Grid for Priority, Date & Assign */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-medium text-slate-300">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(val) => handleValueChange("priority", val)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-slate-300">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-slate-300">Assigned Members</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(val) => handleValueChange("assignedTo", val)}
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <label className="block mb-1 font-medium text-slate-300">Todo Checklist Items</label>
              <TodoListInput
                todoList={taskData.todoChecklists}
                setTodoList={(val) => handleValueChange("todoChecklists", val)}
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block mb-1 font-medium text-slate-300">Resource Attachments & Links</label>
              <AddAttachmentInput
                attachments={taskData.attachments}
                setAttachments={(val) => handleValueChange("attachments", val)}
              />
            </div>

            {error && <p className="text-xs font-medium text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4">
            <button
              type="button"
              className="btn-secondary text-xs"
              onClick={() => {
                clearData();
                onClose();
              }}
            >
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary text-xs">
              {loading ? (
                <>
                  <LuLoader className="animate-spin h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : editingTask ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title="Delete Task">
        <DeleteAlert
          content="Are you sure you want to delete this task? This action cannot be undone."
          onDelete={handleDelete}
          onClose={() => setOpenDeleteAlert(false)}
        />
      </Modal>
    </>
  );
}
