import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ambil API Key dari .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GOOGLE_KEY = process.env.GOOGLE_IMAGE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CSE_ID;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ reply: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // 1. Minta Gemini analisis apakah butuh gambar atau teks
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const decision = await model.generateContent(`
      Jika user meminta gambar, balas: "GAMBAR: <keyword>".
      Jika tidak, balas "TEKS".
      Permintaan: "${message}"
    `);

    const decisionText = decision.response.text().trim();
    console.log("Keputusan Gemini:", decisionText);

    // 2. Jika user meminta gambar
    if (decisionText.startsWith("GAMBAR:")) {
      const keyword = decisionText.replace("GAMBAR:", "").trim();
      console.log("Keyword gambar:", keyword);

      // Cari gambar pakai Google Custom Search API
      const imageRes = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
          keyword
        )}&searchType=image&num=3`
      );

      const imageData = await imageRes.json();

      // Jika error dari Google API
      if (imageData.error) {
        console.error("Google API Error:", imageData.error);
        return NextResponse.json(
          { reply: "⚠️ Terjadi kesalahan saat mencari gambar." },
          { status: 500 }
        );
      }

      // Ambil URL gambar
      const images = imageData.items?.map((item: any) => item.link) || [];

      if (images.length === 0) {
        return NextResponse.json({
          reply: `⚠️ Maaf, tidak ditemukan gambar untuk "${keyword}".`,
        });
      }

      return NextResponse.json({
        reply: `Berikut gambar untuk "${keyword}":`,
        images,
      });
    }

    // 3. Jika user hanya butuh teks
    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { reply: "⚠️ Terjadi kesalahan pada server DeraAI." },
      { status: 500 }
    );
  }
}
