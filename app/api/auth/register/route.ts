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

    const cleanEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return Response.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    // If this email matches SUPERADMIN_EMAIL env var, assign superadmin role
    const superAdminEmail = process.env.SUPERADMIN_EMAIL?.toLowerCase().trim();
    const role = superAdminEmail && cleanEmail === superAdminEmail ? "superadmin" : "admin";

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role,
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
    return Response.json({ message: "Error creating account", error: error.message }, { status: 500 });
  }
}
