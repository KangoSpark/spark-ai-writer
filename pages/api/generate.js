
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
        content: `You are Spark, an AI copywriter working with a creative team. Based on the user input, return a cleanly structured response.

Instructions:
- For each selected format, generate a clearly labeled section:
  - START each section with: '### Format: [Name]'
  - If 'KV Headline': return 5 punchy headline options
  - If 'Manifesto': return a 100–150 word emotional brand statement
  - If 'Social Caption': return 3 short caption options for posts (include tone)
  - If 'OOH': return 3 very short, high-impact lines
  - If 'CTA': return 5 strong call-to-action options
  - If 'Website Copy': return:
    - Headline
    - Subheadline
    - Body Paragraph
    - CTA Button Text

- If Arabic is selected: provide Arabic versions for each output in clearly separated sections
- Do NOT include the original user prompt in the output
- Return everything in clean markdown formatting, ready to be displayed in a web app.

User Request:
${prompt}`
      }],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No output";
  res.status(200).json({ result });
}
