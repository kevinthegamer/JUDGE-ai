export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { story } = req.body;

  if (!story || story.length < 10) {
    return res.status(400).json({ verdict: "Please provide a longer story." });
  }

  const prompt = `
You are an internet judge AI. Give a short and clear verdict on the situation below.

Story:
${story}

Verdict:
`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // 👇 Log the full response so we can debug it
    console.log("OPENAI FULL RESPONSE:", JSON.stringify(data, null, 2));

    const text = data?.choices?.[0]?.text?.trim();

    if (!text || text === "") {
      return res
        .status(500)
        .json({ verdict: "OpenAI responded, but gave no clear verdict." });
    }

    return res.status(200).json({ verdict: text });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res
      .status(500)
      .json({ verdict: "There was a problem talking to OpenAI." });
  }
}
