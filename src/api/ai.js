export async function callAI(messages) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  return await res.json();
}

export async function interpretEvent(eventText, stats) {
  const result = await callAI([
    {
      role: "system",
      content: `
You interpret real-life events for a dream-home tracker.
Return JSON ONLY.
`
    },
    {
      role: "user",
      content: JSON.stringify({ event: eventText, current_stats: stats })
    }
  ]);

  return JSON.parse(result.content);
}
