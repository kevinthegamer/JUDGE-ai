import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function DramaJudge() {
  const [story, setStory] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getVerdict() {
    setLoading(true);
    setVerdict(null);
    const response = await fetch("/api/verdict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story }),
    });
    const data = await response.json();
    setVerdict(data.verdict);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">DramaJudge AI</h1>
      <p className="text-center text-gray-500">
        Drop your story. Let AI decide who's the real villain.
      </p>

      <Textarea
        placeholder="Type your drama here..."
        rows={6}
        value={story}
        onChange={(e) => setStory(e.target.value)}
      />

      <Button onClick={getVerdict} disabled={loading || !story}>
        {loading ? "Judging..." : "Submit to AI"}
      </Button>

      {verdict && (
        <Card className="bg-white shadow-lg mt-4">
          <CardContent>
            <h2 className="text-xl font-semibold">Verdict:</h2>
            <p className="mt-2 text-gray-800">{verdict}</p>
            <p className="text-sm mt-2 text-gray-400 italic">Share your verdict online and spark a debate!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
