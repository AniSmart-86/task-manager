import React, { useEffect, useState, useContext } from "react";
import { LuLoader, LuTrash2 } from "react-icons/lu";
import axiosInstance from "../../utilis/axiosInstance";
import { API_PATHS } from "../../utilis/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import Model from "../Model";
import DeleteAlert from "../DeleteAlert";
import { PRIORITY_DATA } from "../../utilis/data";
import SelectDropdown from "../inputs/SelectDropdown";
import TodoListInput from "../inputs/TodoListInput";
import AddAttachmentInput from "../inputs/AddAttachmentInput";
import SelectUsers from "../inputs/SelectUsers";
import { UserContext } from "../../context/userContext";

const CreatingTask = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  const { editingTask, setEditingTask } = useContext(UserContext);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklists: [],
    attachments: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // 🔹 handle input changes
  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // 🔹 reset form after close
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklists: [],
      attachments: [],
    });
    setEditingTask(null);
  };

  // 🔹 Create Task
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklists?.map((item) => ({
        text: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklists: todolist,
      });

      toast.success("Task created successfully");
      clearData();
      onClose();
    } catch (error) {
      console.error("error creating task", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update Task
  const updateTask = async () => {
    if (!editingTask?._id) return;

    setLoading(true);
    try {
      const todolist = taskData.todoChecklists?.map((item) => {
        const prevTodoChecklists = editingTask?.todoChecklists || [];
        const matchedTask = prevTodoChecklists.find(
          (task) => task.text === item
        );

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(editingTask._id), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklists: todolist,
      });

      toast.success("Task updated successfully");
      clearData();
      onClose();
    } catch (error) {
      console.log("error updating task", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(editingTask._id));
      setOpenDeleteAlert(false);
      toast.success("Task deleted");
      clearData();
      onClose();
    } catch (error) {
      console.log("error deleting task");
    }
  };

  // 🔹 Validation & submit handler
  const handleSubmit = async () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required");
    if (!taskData.description.trim()) return setError("Description is required");
    if (!taskData.dueDate) return setError("Due date is required");
    if (taskData.assignedTo?.length === 0)
      return setError("Task not assigned to any member");
    if (taskData.todoChecklists?.length === 0)
      return setError("Add at least one todo task");

    if (editingTask) {
      updateTask();
    } else {
      createTask();
    }
  };

  // 🔹 Prefill form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTaskData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "Low",
        attachments: editingTask?.attachments || [],
        assignedTo: editingTask?.assignedTo?.map((item) => item?._id) || [],
        todoChecklists:
          editingTask?.todoChecklists?.map((item) => item?.text) || [],
        dueDate: editingTask.dueDate
          ? moment(editingTask.dueDate).format("YYYY-MM-DD")
          : null,
      });
    } else {
      clearData();
    }
  }, [editingTask]);

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 mx-auto flex justify-center items-center w-full h-[calc(100%-1rem)] overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50">
        <div className="grid grid-cols-1 md:grid-cols-4 relative p-4 w-full max-w-2xl max-h-full">
          <div className="form-card col-span-4">
            {/* Header */}
              {editingTask && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded-md px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer mb-7"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            <div className="flex items-center justify-between">
                
              <h2 className="text-xl font-medium">
                {editingTask ? "Update Task" : "Create Task"}
              </h2>

            

              <button
                type="button"
                className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-4 h-4 inline-flex justify-center items-center cursor-pointer"
                onClick={() => {
                  clearData();
                  onClose();
                }}
              >
                ✕
              </button>
            </div>

            {/* Title */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Create a task"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe your task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            {/* Priority / Date / Assign */}
            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData?.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>

              {/* Checklist */}
              <div className="mt-3 col-span-12">
                <label className="text-xs font-medium text-slate-600">
                  Todo Checklist
                </label>
                <TodoListInput
                  todoList={taskData?.todoChecklists}
                  setTodoList={(value) =>
                    handleValueChange("todoChecklists", value)
                  }
                />
              </div>

              {/* Attachments */}
              <div className="mt-3 col-span-12">
                <label className="text-xs font-medium text-slate-600">
                  Add Attachment
                </label>
                <AddAttachmentInput
                  attachments={taskData?.attachments || []}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>
            </div>

            {/* Errors */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            {/* Submit */}
            <div className="flex justify-end mt-7">
              <button
                className="add-btn py-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LuLoader className="animate-spin ml-1" />
                    {editingTask ? <p>Updating task...</p> : <p>Creating task...</p>}
                  </>
                ) : editingTask ? (
                  "UPDATE TASK"
                ) : (
                  "CREATE TASK"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Alert */}
      <Model
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title={"Delete Task"}
      >
        <DeleteAlert
          content={"Are you sure you want to delete this task?"}
          onDelete={() => deleteTask()}
        />
      </Model>
    </>
  );
};

export default CreatingTask;
