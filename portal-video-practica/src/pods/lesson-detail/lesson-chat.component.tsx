import { useState, useRef, useEffect } from "react";
import type { Cursos, Lecciones } from "../../common/models/media.model";
import { sendChatMessage, type ChatMessage } from "./lesson-chat.api";

interface Props {
  course: Cursos;
  lesson: Lecciones;
}

export const LessonChat = ({ course, lesson }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await sendChatMessage(course, lesson, messages, text, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <h2>Asistente IA</h2>

      <div>
        {messages.length === 0 && (
          <p>Pregúntame lo que quieras sobre esta lección.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} data-role={msg.role}>
            <strong>{msg.role === "user" ? "Tú" : "Asistente"}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.content === "" && (
          <p>Pensando...</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta... (Enter para enviar)"
          disabled={loading}
          rows={3}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
};
