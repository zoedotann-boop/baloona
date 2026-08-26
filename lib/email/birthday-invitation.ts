import "server-only"

import { Resend } from "resend"

import { resendConfig } from "@/lib/env"

export interface BirthdayInvitation {
  /** The visitor's own email address, taken from the booking form. */
  to: string
  /** Public URL of the invitation PDF; its bytes are fetched and attached. */
  pdfUrl: string
  /** The celebrant's name, used only in the greeting + subject. */
  celebrantName?: string
}

/** Recipient-facing filename for the attached invitation. */
const ATTACHMENT_FILENAME = "baloona-birthday-invitation.pdf"

/**
 * Email the visitor the ready-made Baloona birthday invitation as a PDF
 * attachment after they submit the booking form.
 *
 * This is a courtesy, not a receipt: like the lead notification it is
 * best-effort and never fails the submission. A missing Resend key or empty
 * recipient is a silent no-op, and any send error is returned for the caller
 * to log rather than surfaced to the visitor. The PDF is a static asset served
 * from `public/`; we fetch its bytes here and attach them inline rather than
 * hand Resend the URL — Resend refuses to download an attachment from
 * `localhost`, so a `path` would work only once deployed.
 */
export async function sendBirthdayInvitation(
  invitation: BirthdayInvitation
): Promise<{ sent: true } | { sent: false; error: string }> {
  const config = resendConfig()
  if (!config) return { sent: false, error: "RESEND_API_KEY is not configured" }
  if (!invitation.to) return { sent: false, error: "No recipient configured" }

  let content: Buffer
  try {
    const response = await fetch(invitation.pdfUrl)
    if (!response.ok)
      return { sent: false, error: `Invitation PDF ${response.status}` }
    content = Buffer.from(await response.arrayBuffer())
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }

  const greeting = invitation.celebrantName
    ? `תודה שבחרתם לחגוג את יום ההולדת של ${escapeHtml(invitation.celebrantName)} איתנו! 🎉`
    : "תודה שבחרתם לחגוג איתנו! 🎉"

  const html = `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;color:#2f2a3d;font-size:16px;line-height:24px">
  <h2 style="margin:0 0 8px;color:#2f2a3d">${greeting}</h2>
  <p style="margin:0 0 8px">מצורפת הזמנה מעוצבת ליום ההולדת 🎈</p>
  <p style="margin:0">תוכלו להדפיס אותה או לצלם מסך ולשלוח לאורחים כהזמנה ליום ההולדת!</p>
  <p style="margin:16px 0 0;font-size:13px;color:#2f6f86">נשמח לראותכם, צוות Baloona 💛</p>
</div>`

  const subject = invitation.celebrantName
    ? `הזמנה ליום ההולדת של ${invitation.celebrantName} 🎉`
    : "ההזמנה ליום ההולדת שלכם 🎉"

  try {
    const { error } = await new Resend(config.apiKey).emails.send({
      from: config.from,
      to: invitation.to,
      subject,
      html,
      attachments: [{ filename: ATTACHMENT_FILENAME, content }],
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
