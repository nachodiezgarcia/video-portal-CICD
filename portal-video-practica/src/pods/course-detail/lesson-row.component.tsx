import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import type { Lecciones } from "../../common/models/media.model";

interface Props {
  lesson: Lecciones;
  courseId: string;
  lessonIndex: number;
}

export const LessonRow = ({ lesson, courseId, lessonIndex }: Props) => (
  <li className="flex items-center justify-between border border-[var(--color-border)] rounded px-4 py-3">
    <span className="text-[var(--color-text)] font-medium truncate mr-4">{lesson.nombre}</span>
    <div className="flex items-center gap-3 shrink-0">
      <span className="text-[var(--color-text-secondary)]">{lesson.tiempo}</span>
      <Link to="/lesson/$courseId/$lessonIndex" params={{ courseId, lessonIndex: String(lessonIndex) }} aria-label="Reproducir lección">
        <PlayCircle size={22} className="text-[var(--color-text)]" />
      </Link>
    </div>
  </li>
);
