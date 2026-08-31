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

    const body = await request.json();
    const isAssigned = task.assignedTo.some((userId: any) => userId.toString() === sessionUser._id.toString());

    if (!isAssigned && sessionUser.role !== "admin") {
      return Response.json({ message: "Not authorized" }, { status: 403 });
    }

    task.status = body.status || task.status;
    if (task.status === "Completed") {
      task.todoChecklists.forEach((item: any) => {
        item.completed = true;
      });
      task.progress = 100;
    }

    await task.save();
    return Response.json({ message: "Task status updated successfully", task });
  } catch (error: any) {
    return Response.json({ message: "Error updating task status", error: error.message }, { status: 500 });
  }
}
