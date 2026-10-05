type SheetSubmission = {
  submissionId: string;
  name: string;
  email: string;
  requestType: "inquiry" | "appointment";
  projectType: string;
  timeline: string;
  message: string;
  preferredDate: string;
  preferredTime: string;
};

export async function saveToGoogleSheets(
  submission: SheetSubmission,
): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!url || !secret) {
    throw new Error("Google Sheets connection is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...submission,
      secret,
    }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.ok !== true) {
    throw new Error("Could not save the submission to Google Sheets.");
  }
}