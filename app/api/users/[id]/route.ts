import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth, isSuperAdmin } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser) return Response.json({ message: "Not authorized, no token" }, { status: 401 });

    const { id } = await params;
    const user = await User.findById(id).select("-password");
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    return Response.json(user);
  } catch (error: any) {
    return Response.json({ message: "Error fetching user", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser || sessionUser.role === "member") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const targetUser = await User.findById(id);
    if (!targetUser) return Response.json({ message: "User not found" }, { status: 404 });

    // Admin can only manage their own workers
    if (sessionUser.role === "admin") {
      const isOwnWorker =
        targetUser.role === "member" && targetUser.createdBy?.toString() === sessionUser._id;
      if (!isOwnWorker) {
        return Response.json({ message: "Access denied: not your worker" }, { status: 403 });
      }
    }

    const body = await request.json();
    if (body.status && ["active", "suspended"].includes(body.status)) {
      targetUser.status = body.status;
    }

    await targetUser.save();
    return Response.json({
      message: `User status updated to ${targetUser.status}`,
      user: { _id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role, status: targetUser.status },
    });
  } catch (error: any) {
    return Response.json({ message: "Error updating user status", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const sessionUser = await requireAuth(request);
    if (!sessionUser || sessionUser.role === "member") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const targetUser = await User.findById(id);
    if (!targetUser) return Response.json({ message: "User not found" }, { status: 404 });

    // Admin can only delete their own workers; superadmin can delete any non-superadmin
    if (sessionUser.role === "admin") {
      const isOwnWorker =
        targetUser.role === "member" && targetUser.createdBy?.toString() === sessionUser._id;
      if (!isOwnWorker) {
        return Response.json({ message: "Access denied: not your worker" }, { status: 403 });
      }
    }
    if (isSuperAdmin(sessionUser) && targetUser.role === "superadmin") {
      return Response.json({ message: "Cannot delete another super admin" }, { status: 403 });
    }

    await targetUser.deleteOne();
    return Response.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return Response.json({ message: "Error deleting user", error: error.message }, { status: 500 });
  }
}
