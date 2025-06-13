
import React, { useState } from "react";

const formats = ["KV Headline", "Manifesto", "Social Caption", "OOH", "CTA", "Website Copy"];
const tones = ["Funny", "Emotional", "Bold", "Inviting", "Urgent", "Premium", "Friendly", "Authoritative"];

const SparkWriter = () => {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [tone, setTone] = useState("Bold");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("English");
  const [idea, setIdea] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const toggleFormat = (format) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `
You are Spark — an AI copywriter. Generate structured outputs for each selected format:
Brand: ${brand}
Product: ${product}
Formats: ${selectedFormats.join(", ")}
Tone: ${tone}
Audience: ${audience}
Core Idea: ${idea}
Language: ${language}
${feedback ? `Feedback: ${feedback}` : ""}

Return each format as a row in a table with:
1. Format
2. English Headline or Body
3. Arabic Version (if requested)
4. CTA (if applicable)
`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setOutput(data.result);
    } catch (error) {
      setOutput("Error generating content.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🪄 Spark — Your AI Copywriter</h1>

      <input placeholder="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} className="mb-3 w-full p-2 border" />
      <input placeholder="Product / Service" value={product} onChange={(e) => setProduct(e.target.value)} className="mb-3 w-full p-2 border" />

      <div className="mb-3">
        <label className="block font-medium mb-1">Select Formats</label>
        <div className="flex flex-wrap gap-2">
          {formats.map(format => (
            <label key={format} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={format}
                checked={selectedFormats.includes(format)}
                onChange={() => toggleFormat(format)}
              />
              {format}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border">
          {tones.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <input placeholder="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} className="mb-3 w-full p-2 border" />
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mb-3 w-full p-2 border">
        <option value="English">English</option>
        <option value="Arabic">Arabic</option>
        <option value="Both">Both</option>
      </select>

      <textarea placeholder="Core Idea to Build On" value={idea} onChange={(e) => setIdea(e.target.value)} className="mb-3 w-full p-2 border" rows={3} />
      <textarea placeholder="Feedback or Edits (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mb-3 w-full p-2 border" rows={2} />

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-black text-white py-2 rounded">
        {loading ? "Generating..." : "Generate Copy"}
      </button>

      {output && (
        <div className="bg-gray-100 p-4 mt-6 rounded-lg whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-2">📋 Output Table:</h2>
          {output}
        </div>
      )}
    </div>
  );
};

export default SparkWriter;
