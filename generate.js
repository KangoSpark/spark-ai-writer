import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    brand,
    product,
    audience,
    idea,
    tone = [],
    output = [],
  } = req.body;

  const promptSections = [];

  if (output.includes('KV Headline') || output.includes('Headline')) {
    promptSections.push("### KV Headline\nGenerate 3–5 high-impact headline options that reflect the brand tone and core idea.");
  }

  if (output.includes('Manifesto')) {
    promptSections.push("### Brand Manifesto\nWrite a short manifesto (2–3 lines) that emotionally captures the essence of the brand and the campaign idea.");
  }

  if (output.includes('Visual Idea')) {
    promptSections.push("### Visual Hook\nDescribe a strong visual metaphor or image that could guide the key visual.");
  }

  if (output.includes('Activation Idea')) {
    promptSections.push("### Activation Idea\nSuggest a creative activation idea that brings the concept to life in an unexpected way.");
  }

  if (output.includes('Social Caption') || output.includes('Social Media Posts')) {
    promptSections.push(
`### Social Media Calendar

| Day | Social Pillar | Definition of the Pillar | Social Caption | Visual Style | Platform |
|-----|----------------|--------------------------|----------------|---------------|----------|
|     |                |                          |                |               |          |
|     |                |                          |                |               |          |
|     |                |                          |                |               |          |
|     |                |                          |                |               |          |
|     |                |                          |                |               |          |

Only return the table above filled with 5 relevant entries based on the brand, audience, and tone. Do not generate any additional copy or explanation.`
    );
  }

  const prompt = 
\`You are a senior creative copywriter working on a campaign for a brand.

**Brand**: \${brand}  
**Product/Service**: \${product}  
**Target Audience**: \${audience}  
**Core Idea**: \${idea}  
**Tone**: \${tone.join(', ')}

Please return the following creative deliverables:

\${promptSections.join('\n\n')}

Use markdown formatting and follow the structure precisely. Do not include outputs that were not requested.\`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
    });

    const result = response.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response from OpenAI' });
  }
}