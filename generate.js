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

  if (output.includes('Headline')) {
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

  if (output.includes('Social Media Posts')) {
    promptSections.push(
`### Social Media Calendar

Generate a social media content calendar table for 5 days.

Each row should include the following columns:
- **Day**
- **Social Pillar** (e.g., product benefit, lifestyle, user moment, seasonal hook)
- **Definition of the Pillar**
- **Social Caption** (short, engaging, on-brand)
- **Visual Style** (mix of static, carousel, video)
- **Platform** (choose from Instagram, TikTok, or Facebook)

Make the table easy to scan and format it in clean Markdown. Align all content with the brand idea, audience, and tone provided.`
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

Structure the output with clear section headers and line breaks. Use markdown-style formatting where helpful. Keep the tone aligned with the brief.\`;

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