"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * AgentMail REST API (verified against agentmail@0.5.35 wire format):
 *   POST https://api.agentmail.to/v0/inboxes                  { client_id }
 *   POST https://api.agentmail.to/v0/inboxes/{id}/messages/send
 * Wire fields: client_id, inbox_id, reply_to; `to` accepts string | string[].
 */
const API_BASE = "https://api.agentmail.to/v0";
/** Fixed client_id makes inbox creation idempotent (safe on every quote). */
const INBOX_CLIENT_ID = "gj-premium-quotes-v1";
const REPLY_TO = "gjpremium14@gmail.com";

async function agentMailRequest(
  apiKey: string,
  path: string,
  body: unknown,
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(
      `AgentMail ${path} failed (${response.status})${detail ? `: ${detail}` : ""}`,
    );
  }

  return (await response.json()) as Record<string, unknown>;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends the requester a confirmation email through AgentMail after their
 * quote request is stored. Best-effort: this runs after the mutation commits,
 * so a delivery failure never loses the quote itself.
 */
export const sendQuoteConfirmation = internalAction({
  args: {
    to: v.string(),
    fullName: v.string(),
    organization: v.string(),
    reference: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.AGENTMAIL_API_KEY;
    if (!apiKey) {
      throw new Error(
        "AGENTMAIL_API_KEY is not set. Add it in the Keys tab to enable quote confirmation emails.",
      );
    }

    // Get-or-create the quotes inbox (client_id is idempotent).
    const inbox = await agentMailRequest(apiKey, "/inboxes", {
      client_id: INBOX_CLIENT_ID,
    });
    const inboxId = inbox.inbox_id;
    if (typeof inboxId !== "string" || inboxId.length === 0) {
      throw new Error("AgentMail did not return an inbox_id.");
    }

    const subject = `Your GJ Premium quote request: ${args.reference}`;
    const text = [
      `Hello ${args.fullName},`,
      "",
      "Thanks for your quote request to GJ Premium. A supply specialist is now",
      "reviewing availability and pricing for your facility.",
      "",
      `  Reference:  ${args.reference}`,
      `  Facility:   ${args.organization}`,
      "",
      "What happens next:",
      "  1. We review your request: items, pack sizes, and availability.",
      "  2. You receive pricing, availability, and a delivery window within one",
      "     business day.",
      "  3. You approve the quote, and we schedule fulfillment.",
      "",
      "Questions? Just reply to this email.",
      "",
      "GJ Premium",
      "Quality · Care · Supply",
      "gjpremium14@gmail.com · +44 7485 206665 · Mon–Fri, 8:00–18:00 ET",
    ].join("\n");

    const html = [
      `<p>Hello ${escapeHtml(args.fullName)},</p>`,
      "<p>Thanks for your quote request to <strong>GJ Premium</strong>. A supply specialist is now reviewing availability and pricing for your facility.</p>",
      `<p><strong>Reference:</strong> ${escapeHtml(args.reference)}<br/>` +
        `<strong>Facility:</strong> ${escapeHtml(args.organization)}</p>`,
      "<p><strong>What happens next</strong></p>",
      "<ol>",
      "<li>We review your request: items, pack sizes, and availability.</li>",
      "<li>You receive pricing, availability, and a delivery window within one business day.</li>",
      "<li>You approve the quote, and we schedule fulfillment.</li>",
      "</ol>",
      "<p>Questions? Just reply to this email.</p>",
      "<p>GJ Premium<br/>Quality · Care · Supply<br/>gjpremium14@gmail.com · +44 7485 206665 · Mon–Fri, 8:00–18:00 ET</p>",
    ].join("");

    await agentMailRequest(apiKey, `/inboxes/${encodeURIComponent(inboxId)}/messages/send`, {
      to: [args.to],
      subject,
      text,
      html,
      reply_to: REPLY_TO,
    });
  },
});
