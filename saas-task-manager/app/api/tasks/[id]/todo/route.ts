import connectDB from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

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

    const isAllowed = task.assignedTo.some((userId: any) => userId.toString() === sessionUser._id.toString()) || sessionUser.role === "admin";
    if (!isAllowed) {
      return Response.json({ message: "Not authorized to update checklist" }, { status: 403 });
    }

    const body = await request.json();
    if (body.todoChecklists) {
      task.todoChecklists = body.todoChecklists;
    }

    const completionCount = task.todoChecklists.filter((item: any) => item.completed).length;
    const totalItems = task.todoChecklists.length;
    task.progress = totalItems > 0 ? Math.round((completionCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In_Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(id).populate("assignedTo", "name email profileImageUrl");

    return Response.json({ message: "Task checklist updated successfully", task: updatedTask });
  } catch (error: any) {
    return Response.json({ message: "Error updating checklist", error: error.message }, { status: 500 });
  }
}
