import connectDB from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter: any = {};
    if (status) filter.status = status;

    const tasks = sessionUser.role === "admin"
      ? await Task.find(filter).populate("assignedTo", "name email profileImageUrl")
      : await Task.find({ ...filter, assignedTo: sessionUser._id }).populate("assignedTo", "name email profileImageUrl");

    const mappedTasks = tasks.map((task: any) => ({
      ...task.toObject(),
      completedTodoCount: task.todoChecklists.filter((item: any) => item.completed).length,
    }));

    const allTasks = await Task.countDocuments(sessionUser.role === "admin" ? {} : { assignedTo: sessionUser._id });
    const pendingTasks = await Task.countDocuments({
      ...(sessionUser.role !== "admin" && { assignedTo: sessionUser._id }),
      status: "Pending",
    });
    const inProgressTasks = await Task.countDocuments({
      ...(sessionUser.role !== "admin" && { assignedTo: sessionUser._id }),
      status: "In_Progress",
    });
    const completedTasks = await Task.countDocuments({
      ...(sessionUser.role !== "admin" && { assignedTo: sessionUser._id }),
      status: "Completed",
    });

    return Response.json({
      tasks: mappedTasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error: any) {
    return Response.json({ message: "Error fetching tasks", error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    if (sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklists } = body;

    if (!title || !dueDate) {
      return Response.json({ message: "Title and dueDate are required" }, { status: 400 });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      dueDate,
      assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
      attachments: Array.isArray(attachments) ? attachments : [],
      todoChecklists: Array.isArray(todoChecklists) ? todoChecklists : [],
      createdBy: sessionUser._id,
    });

    return Response.json({ message: "Task created successfully", task }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: "Error creating task", error: error.message }, { status: 500 });
  }
}
