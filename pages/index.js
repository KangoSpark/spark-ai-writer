
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
  const [history, setHistory] = useState([]);

  const toggleFormat = (format) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `
You are Spark, an AI copywriter for a creative agency. Generate copy in the following format:
- Return output in markdown blocks
- Do NOT use tables
- Each section must begin with '### Format: [Format Name]'
- Arabic content only if 'Arabic' or 'Both' selected
- KV Headline: 5 headline options
- Manifesto: 100–150 word emotional brand statement
- Social Caption: 3 short captions
- OOH: 3 short outdoor lines
- CTA: 5 call-to-action options
- Website Copy: Headline, Subheadline, Body, CTA

Input:
Brand: ${brand}
Product: ${product}
Formats: ${selectedFormats.join(", ")}
Tone: ${tone}
Audience: ${audience}
Language: ${language}
Core Idea: ${idea}
Feedback: ${feedback}
`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setOutput(data.result);
      setHistory(prev => [...prev, data.result]);
    } catch (error) {
      setOutput("Error generating content.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Output copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans bg-white text-black">
      <h1 className="text-4xl font-bold mb-2 text-center">⚡️ Spark by Kango</h1>
      <p className="text-center mb-6 text-gray-600">Your AI copywriter — full version with export, history, and Kango branding.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Product / Service" value={product} onChange={(e) => setProduct(e.target.value)} className="p-2 border rounded" />

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Select Formats</label>
          <div className="flex flex-wrap gap-3">
            {formats.map(format => (
              <label key={format} className="flex items-center gap-1 text-sm">
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

        <div>
          <label className="block mb-1 font-medium">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border rounded">
            {tones.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <input placeholder="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} className="p-2 border rounded md:col-span-2" />
        <textarea placeholder="Core Idea to Build On" value={idea} onChange={(e) => setIdea(e.target.value)} className="p-2 border rounded md:col-span-2" rows={3} />
        <textarea placeholder="Feedback or Edits (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="p-2 border rounded md:col-span-2" rows={2} />
      </div>

      <div className="text-center">
        <button onClick={handleSubmit} disabled={loading} className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800">
          {loading ? "Generating..." : "Generate Copy"}
        </button>
      </div>

      {output && (
        <div className="bg-gray-100 p-6 rounded-lg whitespace-pre-wrap mt-6">
          <h2 className="text-xl font-semibold mb-4">📋 Generated Output</h2>
          <button onClick={copyToClipboard} className="mb-3 bg-blue-600 text-white px-4 py-1 rounded">📋 Copy Output</button>
          <pre>{output}</pre>
        </div>
      )}

      {history.length > 1 && (
        <div className="mt-10">
          <h3 className="font-bold text-lg mb-2">🕘 Past Outputs</h3>
          <ul className="space-y-2 text-sm">
            {history.slice(0, -1).map((item, index) => (
              <li key={index} className="bg-gray-50 p-2 border rounded whitespace-pre-wrap">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SparkWriter;
