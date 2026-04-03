import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, lessonText, customQuestion } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
    }

    let prompt = "";

    switch (action) {
      case "summarize":
        prompt = `You are an expert learning assistant.\nSummarize the following lesson in a simple and clear way for beginners. Use bullet points and short sentences. Highlight the most important ideas only.\n\nLesson:\n${lessonText}`;
        break;
      case "translate_somali":
        prompt = `You are a professional translator.\nTranslate the following lesson into simple Somali language. Make it easy to understand for students. Do not use complex words.\n\nLesson:\n${lessonText}`;
        break;
      case "custom_question":
        prompt = `You are a helpful AI tutor.\nAnswer the student's question based ONLY on the lesson below. Explain clearly with examples. If the answer is not in the lesson, say: "This was not covered in the lesson."\n\nLesson:\n${lessonText}\n\nQuestion:\n${customQuestion}`;
        break;
      case "notes":
        prompt = `You are a smart note-taking assistant.\nCreate clean and organized notes from this lesson. Include:\n- Key points\n- Important terms\n- Short explanations\n\nLesson:\n${lessonText}`;
        break;
      case "quiz":
        prompt = `You are a course instructor.\nCreate 5 multiple choice questions from this lesson. Each question must have 4 options and 1 correct answer. Make it suitable for beginners.\n\nLesson:\n${lessonText}`;
        break;
      case "explain":
        prompt = `You are an expert teacher.\nExplain this lesson in a very simple way as if teaching a beginner. Use examples and real-life comparisons.\n\nLesson:\n${lessonText}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid action type." }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
           temperature: 0.7,
           maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Failed to generate content." }, { status: 500 });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      return NextResponse.json({ error: "No content generated from AI." }, { status: 500 });
    }

    return NextResponse.json({ result: aiText });
  } catch (err: any) {
    console.error("AI Tutor Error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 });
  }
}
