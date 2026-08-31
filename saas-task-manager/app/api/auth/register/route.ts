import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return Response.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    // Auto-assign Admin role to anyone signing up directly
    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

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
    console.error("Register Error:", error);
    return Response.json({ message: "Error creating admin account", error: error.message }, { status: 500 });
  }
}
