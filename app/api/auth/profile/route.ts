import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const user = await User.findById(sessionUser._id).select("-password");
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error: any) {
    return Response.json({ message: "Error fetching profile", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    const user = await User.findById(sessionUser._id);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    user.name = body.name || user.name;
    user.email = body.email || user.email;

    if (body.password) {
      const bcrypt = (await import("bcryptjs")).default;
      user.password = await bcrypt.hash(String(body.password), 10);
    }

    const updatedUser = await user.save();

    return Response.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
    });
  } catch (error: any) {
    return Response.json({ message: "Error updating profile", error: error.message }, { status: 500 });
  }
}
