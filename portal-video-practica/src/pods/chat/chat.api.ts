import type { Cursos } from "../../common/models/media.model";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(courses: Cursos[]): string {
  if (courses.length === 0) {
    return `Eres un tutor experto de un campus de cursos en vídeo sobre desarrollo web y tecnología.
Ayuda a los usuarios con dudas sobre programación, explica conceptos técnicos y orienta sobre qué aprender.
Responde siempre de forma clara, pedagógica y en el mismo idioma que el usuario.`;
  }

  const catalog = courses
    .map((c) => {
      const lessons = c.lecciones
        .map((l) => `  - ${l.nombre} (${l.tiempo}): ${l.descripcion}`)
        .join("\n");
      return `Curso: ${c.nombre}\nDescripción: ${c.descripcion}\nLecciones:\n${lessons}`;
    })
    .join("\n\n");

  return `Eres un tutor experto del campus de cursos en vídeo. Conoces en detalle todo el catálogo disponible y puedes orientar a los usuarios sobre qué aprender, resolver dudas de contenido y recomendar lecciones.

Catálogo completo:
${catalog}

Responde siempre de forma clara, pedagógica y en el mismo idioma que el usuario.`;
}

export async function sendChatMessage(
  courses: Cursos[],
  history: ChatMessage[],
  userMessage: string,
  onChunk: (text: string) => void
): Promise<void> {
  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b:free",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(courses) },
        ...messages,
      ],
    }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.replace("data: ", "");
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch {
        // fragmento incompleto, ignorar
      }
    }
  }
}
