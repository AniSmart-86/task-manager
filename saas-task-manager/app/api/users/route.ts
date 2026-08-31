import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    if (sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const users = await User.find({ role: "member" }).select("-password");

    const usersWithTaskCounts = await Promise.all(
      users.map(async (user: any) => {
        const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In_Progress" });
        const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

        return {
          ...user.toObject(),
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    return Response.json(usersWithTaskCounts);
  } catch (error: any) {
    return Response.json({ message: "Error fetching users", error: error.message }, { status: 500 });
  }
}
