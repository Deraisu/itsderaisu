"use client";
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setShowAnswer(false);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      setAnswer(data.answer || "Sedang di proses.");
      setTimeout(() => setShowAnswer(true), 50);
    } catch {
      setAnswer("Terjadi kesalahan.");
      setShowAnswer(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e8f5e9", // soft green background
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#2e7d32" }}>Chatbot AI</h1>

        <input
          type="text"
          placeholder="Tulis pertanyaan..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #171515ff",
            borderRadius: "8px",
            marginBottom: "12px",
            fontSize: "14px",
            color: "black" // black tex color for better contrast
          }}
        />

        <button
          onClick={sendQuestion}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#a5d6a7" : "#4caf50",
            color: "white",
            padding: "10px",
            width: "100%",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#43a047";
              e.currentTarget.style.transform = "scale(1.03)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#4caf50";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          {loading ? (
            <div
              style={{
                border: "3px solid #775454ff",
                borderTop: "3px solid white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }}
            />
          ) : (
            "Kirim"
          )}
        </button>

        {answer && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#c8e6c9",
              borderRadius: "8px",
              color: "#1b5e20",
              textAlign: "left",
              fontSize: "14px",
              opacity: showAnswer ? 1 : 0,
              transform: showAnswer ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {answer}
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}