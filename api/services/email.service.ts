import type { Env } from "../types";

export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendResendEmail(
  env: Env,
  toEmail: string,
  subject: string,
  messageText: string
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.log("Resend not configured; skipping email send.", { toEmail, subject });
    return;
  }

  const text = messageText ?? "";
  const html = `<p>${escapeHtml(text).replaceAll("\n", "<br/>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Resend email failed:", { status: res.status, body });
  }
}