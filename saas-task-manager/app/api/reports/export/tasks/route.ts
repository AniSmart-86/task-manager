import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import connectDB from "@/lib/db";
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

    const tasks = await Task.find().populate("assignedTo", "name email");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 40 },
    ];

    tasks.forEach((task: any) => {
      const assignedTo = Array.isArray(task.assignedTo)
        ? task.assignedTo.map((user: any) => `${user.name} (${user.email})`).join(", ")
        : task.assignedTo
          ? `${task.assignedTo.name} (${task.assignedTo.email})`
          : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "N/A",
        assignedTo,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="tasks_report.xlsx"',
      },
    });
  } catch (error: any) {
    return Response.json({ message: "Error exporting tasks", error: error.message }, { status: 500 });
  }
}
