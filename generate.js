import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";
  const normalizedOutput = Array.isArray(output) ? output : [output];

  const context = \`You are an expert advertising copywriter creating work for \${brand}, a brand offering \${product}, targeting \${audience}. The core idea of the campaign is: \${idea}. Use \${formattedTone} tone in your writing.\`;

  const prompt = \`\${context}

Based on the selected outputs: \${normalizedOutput.join(", ")}, generate the appropriate advertising content.
Clearly separate each section using markdown headers. Do not include anything else.\`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4"
    });

    res.status(200).json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while generating content." });
  }
}