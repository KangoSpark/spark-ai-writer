import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";
  const formattedOutput = output?.length ? output.join(", ") : "advertising content";

  const context = `You are an expert advertising copywriter creating work for ${brand}, a brand offering ${product}, targeting ${audience}. The core idea of the campaign is: ${idea}. Use a ${formattedTone} tone in your writing.`;

  let prompt = "";

  if (
    output.includes("Social Caption") ||
    output.includes("Social Media Posts")
  ) {
    prompt = `${context}

Generate a Markdown table with 5 planned social posts across the week. Do NOT generate any other copy. Each post should include:

- Day of the week
- Social pillar (choose from: Education, Engagement, Product Focus, Brand Storytelling, Community)
- Definition of the pillar
- A creative social media caption
- A visual style (static, carousel, or video)
- Platform (Instagram, Facebook, TikTok, or LinkedIn)

Format:

| Day       | Social Pillar      | Definition of the Pillar                        | Social Caption                                               | Visual Style | Platform |
|-----------|--------------------|--------------------------------------------------|--------------------------------------------------------------|--------------|----------|
| Monday    |                    |                                                  |                                                              |              |          |
| Wednesday |                    |                                                  |                                                              |              |          |
| Friday    |                    |                                                  |                                                              |              |          |
| Saturday  |                    |                                                  |                                                              |              |          |
| Sunday    |                    |                                                  |                                                              |              |          |

Only return this table.`;
  } else {
    prompt = `${context}

Based on the selected outputs: ${formattedOutput}, generate the appropriate advertising content such as:
- KV Headline Options (5)
- Call to Action (5)
- Brand Manifesto (about 150–200 words)
- Website Headline, Subhead, Body, and CTA
- Social Caption (1 punchy post for Instagram)

Only include the sections that are relevant to the selected outputs. Keep formatting clean and easy to read.`;
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    res.status(200).json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "OpenAI request failed", details: error.message });
  }
}
