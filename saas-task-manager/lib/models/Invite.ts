import mongoose, { Schema } from "mongoose";

const InviteSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, default: "member" },
    status: { type: String, enum: ["pending", "accepted", "expired"], default: "pending" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

export default Invite;
