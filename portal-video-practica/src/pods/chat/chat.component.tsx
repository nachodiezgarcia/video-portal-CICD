import { useState, useRef, useEffect } from "react";
import type { Cursos } from "../../common/models/media.model";
import { getCourses } from "../courses/courses.api";
import { sendChatMessage, type ChatMessage } from "./chat.api";
import { Markdown } from "../../components/markdown/markdown.component";

export const ChatComponent = () => {
  const coursesRef = useRef<Cursos[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCourses().then((data) => { coursesRef.current = data; });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const historyWithUser = [...messages, userMessage];

    setMessages(historyWithUser);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      await sendChatMessage(coursesRef.current, historyWithUser, text, (chunk: string) => {
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
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-(--space-md)">
      <header className="rounded-3xl border border-(--color-border) bg-surface p-(--space-lg) shadow-sm">
        <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-200">Asistente IA</h1>
        <p className="mt-2 text-(--color-text-secondary)">
          Pregunta sobre cursos, lecciones o recomendaciones y te responderé con base en el catálogo disponible.
        </p>
      </header>

      <div className="rounded-3xl border border-(--color-border) bg-surface shadow-sm">
        <div className="max-h-[58vh] min-h-[44vh] space-y-(--space-sm) overflow-y-auto p-(--space-lg)">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-(--color-border) bg-background p-(--space-md)">
              <p className="text-(--color-text-secondary)">
                Hola, soy tu tutor. Pregúntame lo que quieras sobre los cursos disponibles.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              data-role={msg.role}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl border px-(--space-md) py-(--space-sm) md:max-w-[75%] ${
                  msg.role === "user"
                    ? "border-info bg-info text-text-info"
                    : "border-(--color-border) bg-background text-(--color-text)"
                }`}
              >
                <strong className="mb-1 block text-sm">
                  {msg.role === "user" ? "Tú" : "Asistente"}
                </strong>
                {msg.role === "assistant"
                  ? <Markdown content={msg.content || "..."} className="marked text-sm leading-relaxed" />
                  : <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                }
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.content === "" && (
            <p className="text-sm text-(--color-text-secondary)">Pensando...</p>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-(--color-border) bg-[color-mix(in_oklab,var(--color-surface),white_20%)] p-(--space-md)">
          <div className="flex flex-col gap-(--space-sm) md:flex-row">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta... (Enter para enviar)"
              disabled={loading}
              rows={3}
              className="min-h-24 w-full rounded-2xl border border-(--color-border) bg-background p-(--space-sm) text-(--color-text) outline-none transition focus:border-info focus:ring-2 focus:ring-info/30 disabled:opacity-60"
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center rounded-2xl border border-info bg-info px-(--space-md) py-(--space-sm) font-semibold text-text-info shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-32"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
