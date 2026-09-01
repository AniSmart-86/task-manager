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

    // Build workspace filter
    let query: any = {};
    if (sessionUser.role === "admin") {
      query = { adminId: sessionUser._id };
    } else if (sessionUser.role === "member") {
      query = { assignedTo: sessionUser._id };
    }
    // superadmin: no filter

    const totalTasks = await Task.countDocuments(query);
    const pendingTasks = await Task.countDocuments({ ...query, status: "Pending" });
    const completedTasks = await Task.countDocuments({ ...query, status: "Completed" });
    const overDueTasks = await Task.countDocuments({
      ...query,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatus = ["Pending", "In_Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatus.reduce((acc: any, status) => {
      acc[status.replace(/\s+/g, "")] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution.All = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      { $match: query },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevel = taskPriorities.reduce((acc: any, priority) => {
      acc[priority] = taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    return Response.json({
      statistics: { totalTasks, pendingTasks, completedTasks, overDueTasks },
      charts: { taskDistribution, taskPriorityLevel },
      recentTasks,
    });
  } catch (error: any) {
    return Response.json({ message: "Error fetching dashboard data", error: error.message }, { status: 500 });
  }
}
