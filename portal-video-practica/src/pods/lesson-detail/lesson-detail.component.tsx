import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Cursos } from "../../common/models/media.model";
import { getCourse } from "../course-detail/course-detail.api";
import { VideoPlayer } from "../../components/video-player";
import { Markdown } from "../../components/markdown/markdown.component";

interface Props {
  courseId: string;
  lessonIndex: number;
}

export const LessonDetailComponent = ({ courseId, lessonIndex }: Props) => {
  const [course, setCourse] = useState<Cursos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCourse(courseId)
      .then(setCourse)
      .catch(() => setError("Error al cargar la lección"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p className="text-[var(--color-text-secondary)]">Cargando lección...</p>;
  if (error || !course) return <p className="text-[var(--color-error)]">{error}</p>;

  const lesson = course.lecciones[lessonIndex];
  if (!lesson) return <p className="text-[var(--color-error)]">Lección no encontrada</p>;

  const hasNext = lessonIndex + 1 < course.lecciones.length;

  const goToNext = () => {
    navigate({ to: "/lesson/$courseId/$lessonIndex", params: { courseId, lessonIndex: String(lessonIndex + 1) } });
  };

  return (
    <section>
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">{lesson.nombre}</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">{lesson.tiempo}</p>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <VideoPlayer src={lesson.video.url} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="border border-[var(--color-border)] rounded overflow-hidden">
            <img
              src={course.imagen.url}
              alt={course.imagen.alt ?? course.nombre}
              className="w-48 h-48 object-cover"
            />
          </div>
          {hasNext && (
            <button
              onClick={goToNext}
              className="px-6 py-2 border-2 border-[var(--color-text)] rounded font-semibold text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-bg-page)] transition-colors"
            >
              Siguiente Lección
            </button>
          )}
        </div>
      </div>

      <Markdown content={lesson.descripcion} className="marked" />
    </section>
  );
};
