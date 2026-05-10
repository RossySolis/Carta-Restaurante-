// /api/chat.js — El Huancaíno IA con Gemini (GRATUITO)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Método no permitido' });
  }

  const { message: userMessage, systemPrompt } = req.body;

  if (!userMessage) {
    return res.status(400).json({ reply: 'No me mandaste ningún mensaje pe.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: 'Falta la clave de la IA en el servidor.' });
  }

  try {
    const sistema = systemPrompt || `Eres 'El Huancaíno', el asistente virtual y amable anfitrión del restaurante peruano 'Los Sabores de mi Tierra' en Huachipa, Lima, Perú.
MENÚ:
- Pachamanca a la Tierra (papa, camote, habas, humita) - S/ 50.00
- Caja China (piel galleta, papa, mote, sarsa criolla) - S/ 50.00
- Arroz con Pato (con sarsa criolla) - S/ 50.00
- Chicharrón de Chancho (mote, camote, cancha, sarsa criolla) - S/ 50.00
- Caldo de Mote - S/ 25.00
BEBIDAS: Chicha Morada (Jarra S/15, Vaso S/5), Limonada Frozen (Jarra S/18, Vaso S/8)
CÓCTELES PERUANOS: Chilcano, Perú Libre, Pisco Sour, Machu Picchu, Maracuyá Sour, Algarrobina
CÓCTELES INTERNACIONALES: Mojito, Cuba Libre, Laguna Azul, Surprise, Piña Colada, Piscina, Martini
VÍRGENES: Piña Colada Virgen, Algarrobina Virgen, Surprise Virgen
PAGOS: Efectivo, Yape, Tarjeta (+5%)
RESERVAS: WhatsApp 931810266 o 989083813
Habla con calidez criolla y humor peruano (pe, causa, pue). Máximo 3 oraciones. Sin asteriscos ni markdown.`;

    const payload = {
      contents: [
        {
          parts: [{ text: userMessage }]
        }
      ],
      systemInstruction: {
        parts: [{ text: sistema }]
      },
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.8
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Error Gemini:', err);
      throw new Error(`Error de la API: ${response.status}`);
    }

    const data = await response.json();

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Mmm, tuve un problemita. ¿Me repites la pregunta pue?';

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ reply: 'Lo siento paisanito, hay un problema en la cocina ahora mismo. Inténtalo de nuevo pe.' });
  }
}
