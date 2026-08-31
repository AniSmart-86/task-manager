import connectDB from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const { id } = await params;
    const task = await Task.findById(id).populate("assignedTo", "name email profileImageUrl");

    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json(task);
  } catch (error: any) {
    return Response.json({ message: "Error fetching task", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const { id } = await params;
    const task = await Task.findById(id);
    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    task.title = body.title || task.title;
    task.description = body.description || task.description;
    task.priority = body.priority || task.priority;
    task.dueDate = body.dueDate || task.dueDate;
    task.todoChecklists = body.todoChecklists || task.todoChecklists;
    task.attachments = body.attachments || task.attachments;

    if (body.assignedTo) {
      task.assignedTo = Array.isArray(body.assignedTo) ? body.assignedTo : task.assignedTo;
    }

    const updatedTask = await task.save();
    return Response.json({ message: "Task updated successfully", updatedTask });
  } catch (error: any) {
    return Response.json({ message: "Error updating task", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    if (sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const task = await Task.findById(id);
    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    await task.deleteOne();
    return Response.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    return Response.json({ message: "Error deleting task", error: error.message }, { status: 500 });
  }
}
