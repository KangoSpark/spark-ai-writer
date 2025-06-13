
import React, { useState } from "react";

const SparkWriter = () => {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [format, setFormat] = useState("KV Headline");
  const [tone, setTone] = useState("Bold");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("English");
  const [idea, setIdea] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `
You are Spark — an AI-powered creative copywriter.
Generate 5 headline options, body copy, and CTA based on:
Brand: ${brand}
Product/Service: ${product}
Format: ${format}
Tone: ${tone}
Target Audience: ${audience}
Core Idea: ${idea}
Language: ${language}
${feedback ? `Feedback: ${feedback}` : ""}
Ensure tone, clarity, and creativity. Use modern copywriting style. If Arabic, localize thoughtfully.`;

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🪄 Spark — Your AI Copywriter</h1>
      <input placeholder="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} className="mb-3" />
      <input placeholder="Product / Service" value={product} onChange={(e) => setProduct(e.target.value)} className="mb-3" />
      <input placeholder="Format" value={format} onChange={(e) => setFormat(e.target.value)} className="mb-3" />
      <input placeholder="Tone" value={tone} onChange={(e) => setTone(e.target.value)} className="mb-3" />
      <input placeholder="Target Audience" value={audience} onChange={(e) => setAudience(e.target.value)} className="mb-3" />
      <input placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="mb-3" />
      <textarea placeholder="Core Idea to Build On" value={idea} onChange={(e) => setIdea(e.target.value)} className="mb-3" />
      <textarea placeholder="Feedback or Edits (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mb-3" />
      <button onClick={handleSubmit} disabled={loading} className="w-full mb-4">
        {loading ? "Writing..." : "Generate Copy ✍️"}
      </button>
      {output && (
        <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
          <h2 className="font-semibold text-xl mb-2">📋 Output:</h2>
          {output}
        </div>
      )}
    </div>
  );
};

export default SparkWriter;
