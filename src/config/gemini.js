
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const MODEL_NAME = 'llama-3.3-70b-versatile'; 

async function runChat(prompt) {
  if (!API_KEY) {
    return "Xəta: API Key tapılmadı! Zəhmət olmasa .env faylını yoxlayın.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}` // Dinamik açar
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Xətası Detalları:", errorData);
      throw new Error(`HTTP xətası! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Groq API sorğusunda xəta baş verdi:", error);
    return "Üzr istəyirik, bir problem yarandı. Zəhmət olmasa, bir az sonra yenidən cəhd edin.";
  }
}

export default runChat;