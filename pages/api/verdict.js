export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { story } = req.body;

  if (!story || story.length < 10) {
    return res.status(400).json({ verdict: "Please provide a longer story." });
  }

  const prompt = `You are an honest internet judge known for short, clear opinions.\n\nStory: ${story}\n\nVerdict:`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 60,
        temperature: 0.7,
        n: 1,
        stop: ["\\n"]
      })
    });

    const data = await response.json();

    const verdict = data?.choices?.[0]?.text?.trim();

    if (!verdict) {
      return res.status(500).json({ verdict: "AI did not return a clear verdict." });
    }

    res.status(200).json({ verdict });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ verdict: "Error getting verdict. Please try again later." });
  }
}
