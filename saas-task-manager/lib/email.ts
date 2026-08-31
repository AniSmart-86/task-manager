import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendWorkerInviteEmail({
  toEmail,
  inviteLink,
  inviterName,
}: {
  toEmail: string;
  inviteLink: string;
  inviterName: string;
}) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const subject = `${inviterName} invited you to join Taskify SaaS Workspace`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .logo { font-size: 20px; font-weight: bold; color: #8b5cf6; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
          h2 { color: #ffffff; font-size: 22px; margin-top: 0; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
          .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; margin-top: 20px; margin-bottom: 20px; }
          .footer { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); pt: 16px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Taskify SaaS</div>
          <h2>You're Invited!</h2>
          <p><strong>${inviterName}</strong> has invited you to join their workspace on Taskify SaaS as a team worker.</p>
          <p>Click the button below to complete your profile setup, set your password, and start collaborating on tasks:</p>
          <div style="text-align: center;">
            <a href="${inviteLink}" class="btn">Accept Invitation & Set Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Or copy this link into your browser: <br><a href="${inviteLink}" style="color: #8b5cf6;">${inviteLink}</a></p>
          <div class="footer">
            <p>If you were not expecting this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.log("==========================================");
    console.log(`[RESEND MOCK] Email to: ${toEmail}`);
    console.log(`[RESEND MOCK] Subject: ${subject}`);
    console.log(`[RESEND MOCK] Invite Link: ${inviteLink}`);
    console.log("==========================================");
    return { success: true, mocked: true, link: inviteLink };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      html: htmlContent,
    });
    return { success: true, data, link: inviteLink };
  } catch (error: any) {
    console.error("Resend Email error:", error);
    return { success: false, error: error.message, link: inviteLink };
  }
}
