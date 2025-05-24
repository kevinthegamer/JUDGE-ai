export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { story } = req.body;

  if (!story || story.length < 10) {
    return res.status(400).json({ verdict: "Please provide a longer story." });
  }

  try {
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a fair and honest internet judge. Read the story and decide who was in the wrong with a short verdict."
          },
          {
            role: "user",
            content: story
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await chatResponse.json();

    console.log("OPENAI CHAT RESPONSE:", JSON.stringify(data, null, 2));

    const verdict = data?.choices?.[0]?.message?.content?.trim();

    if (!verdict) {
      return res.status(500).json({ verdict: "OpenAI returned no message." });
    }

    return res.status(200).json({ verdict });
  } catch (error) {
    console.error("OpenAI API Chat Error:", error);
    return res.status(500).json({ verdict: "Error talking to OpenAI Chat API." });
  }
}
