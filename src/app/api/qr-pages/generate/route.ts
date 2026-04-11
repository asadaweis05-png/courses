import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { category, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 503 });
    }

    const categoryPrompts: Record<string, string> = {
      romantic: 'Jacayl (romantic love message)',
      birthday: 'Hambalyo dhalasho (birthday wishes)',
      apology: 'Raali galin (sincere apology)',
      friendship: 'Saaxiibtinimo (friendship appreciation)',
      casual: 'Salaan caadi ah (casual greeting)',
      eid: 'Hambalyo ciid (Eid/Islamic greeting)',
      motivational: 'Dhiiri galin (motivational encouragement)',
    };

    const prompt = `You are a creative Somali writer. Write a short emotional message in Af-Soomaali for the category: ${categoryPrompts[category] || category}.
${context ? `Context/details from the sender: "${context}"` : ''}

Rules:
- Write in natural, warm, emotional Af-Soomaali (NOT a translation from English)
- Keep it 2-4 sentences maximum
- Make it feel personal and authentic
- Do NOT include any English words
- Do NOT add quotes around the message
- Do NOT add any labels or prefixes
- Just output the message text directly`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 200 },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json({ error: 'No text generated' }, { status: 502 });
    }

    return NextResponse.json({ message: text });
  } catch (err: any) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
