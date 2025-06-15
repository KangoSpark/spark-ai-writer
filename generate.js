import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  console.log("Received body:", req.body); // Debug log

  let prompt = "";

  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";
  const context = `You are an expert advertising copywriter creating work for ${brand}, a brand offering ${product}, targeting ${audience}. The core idea of the campaign is: ${idea}. Use ${formattedTone} tone in your writing.`;

  // Normalize all output values to lowercase for safer matching
  const outputNormalized = output.map(item => item.toLowerCase());

  if (
    outputNormalized.includes("social media posts") ||
    outputNormalized.includes("social caption") ||
    outputNormalized.includes("social captions")
  ) {
    prompt = `${context}

ONLY generate the following Markdown table with 5 rows. Do NOT include any extra copy, fallback options, or commentary. ONLY return the table.

| Day       | Social Pillar      | Definition of the Pillar                        | Social Caption                                               | Visual Style | Platform |
|-----------|--------------------|--------------------------------------------------|--------------------------------------------------------------|--------------|----------|
| Monday    |                    |                                                  |                                                              |              |          |
| Wednesday |                    |                                                  |                                                              |              |          |
| Friday    |                    |                                                  |                                                              |              |          |
| Saturday  |                    |                                                  |                                                              |              |          |
| Sunday    |                    |                                                  |                                                              |              |          |

Be sure to fill out all columns appropriately and DO NOT generate anything else.`;
  } else {
    prompt = `${context}

Based on the selected outputs: ${output.join(", ")}, generate the appropriate advertising content.`;
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4"
  });

  res.status(200).json({ result: chatCompletion.choices[0].message.content });
}
