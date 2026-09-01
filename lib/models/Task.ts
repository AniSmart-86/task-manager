import mongoose, { Schema } from "mongoose";

const TodoItemSchema = new Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In_Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    // adminId: the workspace admin who owns this task (for multi-tenant isolation)
    adminId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    attachments: [{ type: String }],
    todoChecklists: [TodoItemSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
