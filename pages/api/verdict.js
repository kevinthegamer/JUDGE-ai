export default async function handler(req, res) {
  const { story } = req.body;

  if (!story) {
    return res.status(400).json({ verdict: "No story provided." });
  }

  const prompt = `You are a wise and impartial internet judge. Here's a story:\n\n${story}\n\nWho was in the wrong? Give a short, clear verdict.`;

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
        max_tokens: 100,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const verdict = data.choices?.[0]?.text?.trim() || "Unable to determine verdict.";

    res.status(200).json({ verdict });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ verdict: "Error generating verdict. Please try again later." });
  }
}
