// /api/chat.js — El Huancaíno IA con Claude (Anthropic)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Método no permitido' });
  }

  const { message: userMessage, systemPrompt } = req.body;

  if (!userMessage) {
    return res.status(400).json({ reply: 'No me mandaste ningún mensaje pe.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: 'Falta configurar la clave de la IA en el servidor.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt || `Eres 'El Huancaíno', el asistente virtual y amable anfitrión del restaurante peruano 'Los Sabores de mi Tierra' ubicado en Calle las Gaviotas frente a la Piscina Paraíso de Huachipa, Lima, Perú.
MENÚ EXACTO:
- Pachamanca a la Tierra (papa, camote, habas, humita, sabor mixto) - S/ 50.00
- Caja China (piel galleta, con papa, mote y sarsa criolla) - S/ 50.00
- Arroz con Pato (jugoso con sarsa criolla) - S/ 50.00
- Chicharrón de Chancho (mote, camote, cancha, sarsa criolla) - S/ 50.00
- Caldo de Mote (sustancioso) - S/ 25.00
BEBIDAS: Chicha Morada (Jarra 1L S/15, Vaso S/5), Limonada Frozen (Jarra 1L S/18, Vaso S/8)
CÓCTELES PERUANOS: Chilcano Clásico, Perú Libre, Pisco Sour, Machu Picchu, Maracuyá Sour, Algarrobina
CÓCTELES INTERNACIONALES: Mojito, Cuba Libre, Laguna Azul, Surprise, Piña Colada, Piscina, Martini
VÍRGENES (sin alcohol): Piña Colada Virgen, Algarrobina Virgen, Surprise Virgen
MEDIOS DE PAGO: Efectivo, Yape, Tarjeta (+5%)
RESERVAS: WhatsApp 931810266 o 989083813
SHOW EN VIVO con música peruana.
Habla con calidez, picardía criolla y humor peruano (pe, causa, pue, oe). Sé breve (máximo 3 oraciones). No uses asteriscos ni markdown. Solo responde sobre el restaurante y su carta.`,
        messages: [
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Error Anthropic:', err);
      throw new Error(`Error de la API: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.find(b => b.type === 'text')?.text
      || 'Mmm, tuve un problemita recordando la receta. ¿Me repites la pregunta pue?';

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ reply: 'Lo siento paisanito, hay un problema en la cocina ahora mismo. Inténtalo de nuevo pe.' });
  }
}
