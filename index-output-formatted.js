
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
You are Spark, an AI copywriter for a creative agency. Generate markdown-formatted copy with clean section labels.
Use the following input:
Brand: ${brand}
Product: ${product}
Formats: ${selectedFormats.join(", ")}
Tone: ${tone}
Audience: ${audience}
Language: ${language}
Idea: ${idea}
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
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 font-sans text-black">
      <h1 className="text-4xl font-bold text-center">⚡️ Spark by Kango</h1>
      <p className="text-center text-gray-600">Your AI copywriter — full version with export, history, and Kango branding.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">Brand Name</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="space-y-2">
          <label className="font-medium">Product / Service</label>
          <input value={product} onChange={(e) => setProduct(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Select Formats</label>
        <div className="flex flex-wrap gap-4">
          {formats.map(format => (
            <label key={format} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={format} checked={selectedFormats.includes(format)} onChange={() => toggleFormat(format)} />
              {format}
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 border rounded">
            {tones.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="font-medium">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
            <option value="English">English</option>
            <option value="Arabic">Arabic</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Target Audience</label>
        <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Core Idea</label>
        <textarea value={idea} onChange={(e) => setIdea(e.target.value)} className="w-full p-2 border rounded" rows={3} />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Feedback or Edits (optional)</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-2 border rounded" rows={2} />
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
          <div className="space-y-4 text-left text-gray-800 text-base">
  {output.split('\n').map((line, index) => (
    <p key={index} className="leading-relaxed">{line}</p>
  ))}
</div>
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
