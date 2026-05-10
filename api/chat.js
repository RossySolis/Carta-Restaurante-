// /api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') return res.status(405).json({ reply: "Método no permitido" });

  const { message: userMessage, systemPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // variable de entorno de Vercel

  try {
    // Payload explícito
    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    // Llamada a la API de Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    // Revisar si la respuesta es OK
    if (!response.ok) throw new Error(`Error en la API de Gemini: ${response.statusText}`);

    const data = await response.json();

    // Obtener la respuesta de Gemini
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text 
                  || "Mmm, tuve un problema recordando la receta. ¿Me repites la pregunta?";

    // Devolver al frontend
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Error en /api/chat:", error);
    res.status(500).json({ reply: "Lo siento paisanito, hay un problema en la cocina ahora mismo." });
  }
}