
export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: `You are Spark, the AI copywriter for Kango. Return markdown-formatted output by format. Include:
- 5 headline options
- Structured CTA list
- Full manifesto
- Website copy broken into headline, subhead, body, CTA
- Only include Arabic if 'Arabic' or 'Both' is selected

Clearly separate each format with section headers. No tables. Clean markdown only.

Prompt:
${prompt}`
      }],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No output";
  res.status(200).json({ result });
}
