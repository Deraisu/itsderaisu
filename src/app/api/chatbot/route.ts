import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(question);
    const answer = result.response.text();

    return new Response(JSON.stringify({ answer }), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), { status: 500 });
  }
}