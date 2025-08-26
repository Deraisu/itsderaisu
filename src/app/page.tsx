"use client";
import { useState, useRef, useEffect } from "react";
import { FaPaperclip } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

interface Message {
  role: "assistant" | "user";
  content: string;
  type?: "text" | "image";
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there, I’m DeraAI. What should we dive into today?",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil respons dari API");
      }

      const data = await res.json();

      if (data.images && data.images.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "Berikut gambar yang kamu minta:",
            type: "text",
          },
          ...data.images.map((imgUrl: string) => ({
            role: "assistant",
            content: imgUrl,
            type: "image",
          })),
        ]);
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, type: "text" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Maaf, DeraAI tidak menemukan jawaban.",
            type: "text",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Terjadi kesalahan. Coba lagi.",
          type: "text",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  const handleOpenFolder = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files)
        .map((f) => f.name)
        .join(", ");
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `📂 Selected: ${fileNames}`, type: "text" },
      ]);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        color: "#e2e8f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#60a5fa" }}>
          DeraAI.
        </h1>
        <h2 style={{ fontSize: "22px", fontWeight: "normal", opacity: 0.8 }}>
          What should we dive into today?
        </h2>
      </div>

      {/* Chat Box */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          marginBottom: "20px",
        }}
      >
        {/* Messages */}
        <div
          style={{
            height: "350px",
            overflowY: "auto",
            marginBottom: "16px",
            padding: "10px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                margin: "12px 0",
                lineHeight: "1.6",
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeSlideIn 0.4s ease forwards",
              }}
            >
              <div style={{ maxWidth: "80%" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    color: m.role === "assistant" ? "#60a5fa" : "#38bdf8",
                    marginBottom: "6px",
                    textAlign: m.role === "user" ? "right" : "left",
                  }}
                >
                  {m.role === "assistant" ? "DeraAI" : ""}
                </p>
                {m.type === "image" ? (
                  <img
                    src={m.content}
                    alt="Generated"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      marginTop: "4px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                      animation: "scaleIn 0.3s ease",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      background:
                        m.role === "assistant" ? "#334155" : "#2563eb",
                      color: m.role === "assistant" ? "#e2e8f0" : "white",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      display: "inline-block",
                      border: m.role === "assistant"
                        ? "1.5px solid #60a5fa55"
                        : "1.5px solid #38bdf8aa",
                      boxShadow:
                        m.role === "user"
                          ? "0 2px 8px rgba(37,99,235,0.5)"
                          : "0 2px 8px rgba(96,165,250,0.5)",
                      animation: "scaleIn 0.3s ease",
                    }}
                    dangerouslySetInnerHTML={{ __html: m.content }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ margin: "12px 0", lineHeight: "1.6" }}>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#60a5fa",
                  marginBottom: "6px",
                }}
              >
                DeraAI:
              </p>
              <div
                style={{
                  background: "#334155",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  display: "inline-block",
                  position: "relative",
                  width: "60px",
                  height: "20px",
                  animation: "fadeSlideIn 0.4s ease forwards",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#60a5fa",
                      borderRadius: "50%",
                      animation: "blink 1s infinite ease-in-out alternate",
                      animationDelay: "0s",
                    }}
                  />
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#60a5fa",
                      borderRadius: "50%",
                      animation: "blink 1s infinite ease-in-out alternate",
                      animationDelay: "0.2s",
                    }}
                  />
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#60a5fa",
                      borderRadius: "50%",
                      animation: "blink 1s infinite ease-in-out alternate",
                      animationDelay: "0.4s",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#1e293b",
            border: "1.5px solid #334155",
            borderRadius: "12px",
            padding: "8px 12px",
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="Message DeraAI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#e2e8f0",
              outline: "none",
              fontSize: "16px",
            }}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            style={{ display: "none" }}
            multiple
            accept=".txt,.md,.json,.csv"
          />

          {/* Tombol Fitur */}
          <button
            type="button"
            onClick={handleOpenFolder}
            style={{
              marginRight: "8px",
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "22px",
              cursor: "pointer",
              transition: "0.2s",
            }}
            title="Upload file"
          >
            <FaPaperclip />
          </button>

          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#2563eb",
              border: "none",
              cursor: "pointer",
              color: "white",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            <IoSend />
          </button>
        </form>
      </div>

      {/* Animasi */}
      <style>{`
        @keyframes blink {
          0% { opacity: 0.2; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
