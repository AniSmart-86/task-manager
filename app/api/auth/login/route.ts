import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return Response.json({ message: "Invalid email" }, { status: 401 });
    }

    if (user.status === "suspended") {
      return Response.json(
        { message: "Your account has been suspended by your administrator. Please contact your manager." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid password" }, { status: 401 });
    }

    return Response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      profileImageUrl: user.profileImageUrl,
      token: signToken(String(user._id)),
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return Response.json({ message: "Error logging in", error: error.message }, { status: 500 });
  }
}
