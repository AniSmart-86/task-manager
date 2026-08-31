import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const { id } = await params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error: any) {
    return Response.json({ message: "Error fetching user", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser || sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return Response.json({ message: "Worker user not found" }, { status: 404 });
    }

    const body = await request.json();
    if (body.status && ["active", "suspended"].includes(body.status)) {
      user.status = body.status;
    }

    await user.save();

    return Response.json({
      message: `Worker account status updated to ${user.status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    return Response.json({ message: "Error updating worker status", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser || sessionUser.role !== "admin") {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
      return Response.json({ message: "Worker user not found" }, { status: 404 });
    }

    await user.deleteOne();

    return Response.json({ message: "Worker deleted successfully" });
  } catch (error: any) {
    return Response.json({ message: "Error deleting worker", error: error.message }, { status: 500 });
  }
}
