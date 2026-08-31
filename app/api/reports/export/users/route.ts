import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    if (sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const users = await User.find().select("name email _id").lean();
    const userTaskMap: Record<string, any> = {};

    users.forEach((user: any) => {
      userTaskMap[user._id.toString()] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    const tasks = await Task.find().populate("assignedTo", "name email _id");

    tasks.forEach((task: any) => {
      if (Array.isArray(task.assignedTo)) {
        task.assignedTo.forEach((assignedUser: any) => {
          const key = assignedUser._id.toString();
          if (userTaskMap[key]) {
            userTaskMap[key].taskCount += 1;
            if (task.status === "Pending") userTaskMap[key].pendingTasks += 1;
            if (task.status === "In_Progress") userTaskMap[key].inProgressTasks += 1;
            if (task.status === "Completed") userTaskMap[key].completedTasks += 1;
          }
        });
      }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((user) => worksheet.addRow(user));

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="users_report.xlsx"',
      },
    });
  } catch (error: any) {
    return Response.json({ message: "Error exporting users", error: error.message }, { status: 500 });
  }
}
