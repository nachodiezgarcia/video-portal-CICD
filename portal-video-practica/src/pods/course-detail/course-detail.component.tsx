import { useEffect, useState } from "react";
import type { Cursos } from "../../common/models/media.model";
import { getCourse } from "./course-detail.api";
import { LessonRow } from "./lesson-row.component";
import { sumTotalTime } from "./time.utils";
import { Markdown } from "../../components/markdown";

interface Props {
  courseId: string;
}

export const CourseDetailComponent = ({ courseId }: Props) => {
  const [course, setCourse] = useState<Cursos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);

  useEffect(() => {
    getCourse(courseId)
      .then(setCourse)
      .catch(() => setError("Error al cargar el curso"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p className="text-[var(--color-text-secondary)]">Cargando curso...</p>;
  if (error || !course) return <p className="text-[var(--color-error)]">{error}</p>;

  const totalTime = sumTotalTime(course.lecciones.map((l) => l.tiempo));

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-primary-700 dark:text-primary-200">{course.nombre}</h1>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div
            className="border border-[var(--color-border)] rounded p-4"
            style={{
              maxHeight: expandedDescription ? "none" : "18rem",
              overflow: "hidden",
            }}
          >
            <Markdown content={course.descripcion} className="description" />
          </div>

          <button
            type="button"
            className="mt-2 text-sm font-semibold underline underline-offset-2"
            style={{ color: "var(--color-link)" }}
            onClick={() => setExpandedDescription((prev) => !prev)}
          >
            {expandedDescription ? "Leer menos..." : "Leer más..."}
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 md:sticky md:top-6 md:self-start">
          <div className="border border-[var(--color-border)] rounded overflow-hidden">
            <img
              src={course.imagen.url}
              alt={course.imagen.alt ?? course.nombre}
              className="w-48 h-48 object-cover"
            />
          </div>
          <span className="text-[var(--color-text)] font-medium border-b border-[var(--color-text)] pb-1">
            {totalTime}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {course.lecciones.map((lesson, i) => (
          <LessonRow key={i} lesson={lesson} courseId={courseId} lessonIndex={i} />
        ))}
      </ul>
    </section>
  );
};
