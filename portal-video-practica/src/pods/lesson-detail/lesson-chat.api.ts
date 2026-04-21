import type { Cursos, Lecciones } from "../../common/models/media.model";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(course: Cursos, lesson: Lecciones): string {
  return `Eres un tutor experto especializado en el siguiente curso y lección.

Curso: ${course.nombre}
Descripción del curso: ${course.descripcion}

Lección actual: ${lesson.nombre}
Duración: ${lesson.tiempo}
Contenido de la lección:
${lesson.descripcion}

Tu rol es responder preguntas relacionadas con este contenido de forma clara y pedagógica. Si el usuario pregunta algo fuera del ámbito del curso, redirigele amablemente hacia los temas tratados. Responde siempre en el mismo idioma que el usuario.`;
}

export async function sendChatMessage(
  course: Cursos,
  lesson: Lecciones,
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
      model: "meta-llama/llama-3.1-8b-instruct:free",
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(course, lesson) },
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
