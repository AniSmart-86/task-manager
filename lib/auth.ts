import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";

export type SessionUser = {
  _id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "member";
  profileImageUrl?: string | null;
};

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "task-manager-secret", {
    expiresIn: "7d",
  });
}

export async function requireAuth(req: Request | NextRequest): Promise<SessionUser | null> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "task-manager-secret") as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return null;
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
    };
  } catch {
    return null;
  }
}

/** Returns true if the user is a superadmin */
export function isSuperAdmin(user: SessionUser) {
  return user.role === "superadmin";
}

/** Returns true if the user is an admin or superadmin */
export function isAdmin(user: SessionUser) {
  return user.role === "admin" || user.role === "superadmin";
}
