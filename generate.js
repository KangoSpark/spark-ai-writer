import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";
  const context = `You are an expert advertising copywriter creating work for ${brand}, a brand offering ${product}, targeting ${audience}. The core idea of the campaign is: ${idea}. Use ${formattedTone} tone in your writing.`;

  const prompt = `${context}

Please return clean markdown-formatted advertising content for the following formats, in this exact order:

1. **KV Headline**
2. **OOH Headlines** (5 options)
3. **Manifesto**
4. **Body Copy**

Each section should be clearly labeled with bold markdown headers. No tables, no extra commentary, no fallback content. Just clean, structured copy in markdown format.`;

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
