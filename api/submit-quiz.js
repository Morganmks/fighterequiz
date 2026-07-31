// Vercel serverless function
// Receives { email, archetype, fitPreference, answers[] } from the quiz frontend.
// Fans out to two places:
//   1. MailerLite — adds/updates the subscriber, tagged with archetype + fit preference,
//      triggers the "Quiz Takers" group automation.
//   2. Google Sheets (via Apps Script webhook) — logs the full raw response row,
//      one row per completed quiz, for manual review.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, archetype, fitPreference, answers } = req.body || {};

  if (!email || !archetype) {
    return res.status(400).json({ error: "Missing email or archetype" });
  }

  const results = await Promise.allSettled([
    sendToMailerLite(email, archetype, fitPreference),
    sendToSheet(email, archetype, fitPreference, answers),
  ]);

  const [mailerliteResult, sheetResult] = results;

  if (mailerliteResult.status === "rejected") {
    console.error("MailerLite failed:", mailerliteResult.reason);
  }
  if (sheetResult.status === "rejected") {
    console.error("Sheet logging failed:", sheetResult.reason);
  }

  // Even if one integration fails, don't block the user from seeing their result,
  // the frontend already shows the reveal regardless of this response.
  return res.status(200).json({
    success: true,
    mailerlite: mailerliteResult.status === "fulfilled",
    sheet: sheetResult.status === "fulfilled",
  });
}

async function sendToMailerLite(email, archetype, fitPreference) {
  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_QUIZ_GROUP_ID;

  if (!API_KEY || !GROUP_ID) {
    throw new Error("Missing MAILERLITE_API_KEY or MAILERLITE_QUIZ_GROUP_ID env vars");
  }

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: {
        fighter_type: archetype,
        fit_preference: fitPreference || "",
      },
      groups: [GROUP_ID],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "MailerLite request failed");
  }
  return data;
}

async function sendToSheet(email, archetype, fitPreference, answers) {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    throw new Error("Missing GOOGLE_SHEETS_WEBHOOK_URL env var");
  }

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      email,
      archetype,
      fitPreference: fitPreference || "",
      answers: answers || [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Sheet webhook responded with ${response.status}`);
  }
  return true;
}
