import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth, isSuperAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser || !isSuperAdmin(sessionUser)) {
      return Response.json({ message: "Super admin access required" }, { status: 403 });
    }

    const admins = await User.find({ role: "admin" }).select("-password").lean();

    const adminsWithStats = await Promise.all(
      admins.map(async (admin: any) => {
        const workerCount = await User.countDocuments({ role: "member", createdBy: admin._id });
        const taskCount = await Task.countDocuments({ adminId: admin._id });
        const pendingTasks = await Task.countDocuments({ adminId: admin._id, status: "Pending" });
        const completedTasks = await Task.countDocuments({ adminId: admin._id, status: "Completed" });

        return {
          ...admin,
          workerCount,
          taskCount,
          pendingTasks,
          completedTasks,
        };
      })
    );

    // Platform-wide totals
    const totalAdmins = admins.length;
    const totalWorkers = await User.countDocuments({ role: "member" });
    const totalTasks = await Task.countDocuments({});
    const totalCompleted = await Task.countDocuments({ status: "Completed" });
    const totalPending = await Task.countDocuments({ status: "Pending" });

    return Response.json({
      admins: adminsWithStats,
      platformStats: { totalAdmins, totalWorkers, totalTasks, totalCompleted, totalPending },
    });
  } catch (error: any) {
    return Response.json({ message: "Error fetching admins", error: error.message }, { status: 500 });
  }
}
