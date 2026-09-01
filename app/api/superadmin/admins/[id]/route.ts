import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth, isSuperAdmin } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser || !isSuperAdmin(sessionUser)) {
      return Response.json({ message: "Super admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const admin = await User.findById(id);
    if (!admin) return Response.json({ message: "Admin not found" }, { status: 404 });
    if (admin.role === "superadmin") {
      return Response.json({ message: "Cannot modify another super admin" }, { status: 403 });
    }

    const body = await request.json();
    if (body.status && ["active", "suspended"].includes(body.status)) {
      admin.status = body.status;
    }

    await admin.save();
    return Response.json({
      message: `Admin ${admin.name} status updated to ${admin.status}`,
      admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, status: admin.status },
    });
  } catch (error: any) {
    return Response.json({ message: "Error updating admin", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser || !isSuperAdmin(sessionUser)) {
      return Response.json({ message: "Super admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const admin = await User.findById(id);
    if (!admin) return Response.json({ message: "Admin not found" }, { status: 404 });
    if (admin.role === "superadmin") {
      return Response.json({ message: "Cannot delete another super admin" }, { status: 403 });
    }

    // Delete admin's workers and tasks too
    await User.deleteMany({ role: "member", createdBy: admin._id });
    await Task.deleteMany({ adminId: admin._id });
    await admin.deleteOne();

    return Response.json({ message: `Admin ${admin.name} and all their workspace data deleted` });
  } catch (error: any) {
    return Response.json({ message: "Error deleting admin", error: error.message }, { status: 500 });
  }
}
