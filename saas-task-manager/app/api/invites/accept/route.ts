import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Invite from "@/lib/models/Invite";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { token, name, password } = body;

    if (!token || !name || !password) {
      return Response.json({ message: "Token, name, and password are required" }, { status: 400 });
    }

    const invite = await Invite.findOne({ token, status: "pending" });
    if (!invite) {
      return Response.json({ message: "Invalid or expired invitation" }, { status: 404 });
    }

    if (new Date() > new Date(invite.expiresAt)) {
      invite.status = "expired";
      await invite.save();
      return Response.json({ message: "Invitation link has expired" }, { status: 410 });
    }

    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) {
      return Response.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: "member",
      status: "active",
      createdBy: invite.invitedBy,
    });

    invite.status = "accepted";
    await invite.save();

    return Response.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImageUrl: user.profileImageUrl,
        token: signToken(String(user._id)),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ message: "Error activating worker account", error: error.message }, { status: 500 });
  }
}
