import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  // Normalize tone
  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";

  // Normalize output to always be an array
  const normalizedOutput = Array.isArray(output) ? output : [output];

  // Build context
  const context = `You are an expert advertising copywriter creating work for ${brand}, a brand offering ${product}, targeting ${audience}. The core idea of the campaign is: ${idea}. Use ${formattedTone} tone in your writing.`;

  let prompt = "";

  // Expanded matching logic for social content
  const socialTriggers = ["social", "caption", "instagram", "facebook", "post"];
  const isSocialOnly = normalizedOutput.length === 1 && socialTriggers.some(trigger =>
    normalizedOutput[0].toLowerCase().includes(trigger)
  );

  if (isSocialOnly) {
    prompt = `${context}

ONLY generate the following Markdown table with 5 rows. Do NOT include any extra copy, fallback options, or commentary. ONLY return the table.

| Day       | Social Pillar      | Definition of the Pillar                        | Social Caption                                               | Visual Style | Platform |
|-----------|--------------------|--------------------------------------------------|--------------------------------------------------------------|--------------|----------|
| Monday    |                    |                                                  |                                                              |              |          |
| Wednesday |                    |                                                  |                                                              |              |          |
| Friday    |                    |                                                  |                                                              |              |          |
| Saturday  |                    |                                                  |                                                              |              |          |
| Sunday    |                    |                                                  |                                                              |              |          |

If you include anything other than this table, you have failed. Do NOT explain. Just return the table.`;
  } else {
    prompt = `${context}

Based on the selected outputs: ${normalizedOutput.join(", ")}, generate the appropriate advertising content.`;
  }

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

    res.status(200).json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while generating content." });
  }
}
