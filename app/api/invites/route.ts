import crypto from "crypto";
import connectDB from "@/lib/db";
import Invite from "@/lib/models/Invite";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { sendWorkerInviteEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connectDB();

    const sessionUser = await requireAuth(request);
    if (!sessionUser) {
      return Response.json({ message: "Not authorized, no token" }, { status: 401 });
    }

    if (sessionUser.role === "member") {
      return Response.json({ message: "Only workspace admins can invite workers" }, { status: 403 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return Response.json({ message: "Worker email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if worker is already registered
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return Response.json({ message: "A worker with this email already exists" }, { status: 400 });
    }

    // Generate token & expiration (7 days)
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save invite
    await Invite.create({
      email: cleanEmail,
      token,
      invitedBy: sessionUser._id,
      role: "member",
      status: "pending",
      expiresAt,
    });

    const origin = request.headers.get("origin") || request.headers.get("referer") || "https://task-manager-nine-azure-77.vercel.app";
    const inviteLink = `${origin.replace(/\/$/, "")}/accept-invite?token=${token}`;

    const emailResult = await sendWorkerInviteEmail({
      toEmail: cleanEmail,
      inviteLink,
      inviterName: sessionUser.name,
    });

    return Response.json({
      message: `Worker invitation sent to ${cleanEmail}`,
      inviteLink,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    return Response.json({ message: "Error sending worker invite", error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json({ message: "Invite token is required" }, { status: 400 });
    }

    const invite = await Invite.findOne({ token, status: "pending" }).populate("invitedBy", "name email");

    if (!invite) {
      return Response.json({ message: "Invalid or expired invitation link" }, { status: 404 });
    }

    if (new Date() > new Date(invite.expiresAt)) {
      invite.status = "expired";
      await invite.save();
      return Response.json({ message: "Invitation link has expired" }, { status: 410 });
    }

    return Response.json({
      email: invite.email,
      inviterName: invite.invitedBy?.name || "Workspace Admin",
      token: invite.token,
    });
  } catch (error: any) {
    return Response.json({ message: "Error validating invite", error: error.message }, { status: 500 });
  }
}
