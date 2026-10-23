import "server-only";

type Notice = { subject: string; lines: [string, string | null | undefined][] };

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export async function notifyAcademy({ subject, lines }: Notice) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!key || !to || !from) return;

  const rows = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${escape(label)}:</strong> ${escape(String(value)).replace(/\n/g, "<br>")}</p>`)
    .join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#0f172a">${rows}</div>`,
      }),
    });
    if (!res.ok) console.error("notifyAcademy", res.status, await res.text());
  } catch (error) {
    console.error("notifyAcademy", error);
  }
}
