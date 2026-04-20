import { useEffect, useState } from "react";
import type { Cursos } from "../../common/models/media.model";
import { getCourses } from "./courses.api";
import { CourseCard } from "./course-card.component";

export const CoursesComponent = () => {
  const [courses, setCourses] = useState<Cursos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setError("Error al cargar los cursos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-(--color-border) bg-surface p-(--space-xl) shadow-sm">
        <p className="text-(--color-text-secondary)">Cargando cursos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-[color-mix(in_oklab,var(--color-error),transparent_65%)] bg-[color-mix(in_oklab,var(--color-error),white_92%)] p-(--space-xl) shadow-sm">
        <p className="font-medium text-(--color-error-text)">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-(--space-xl)">
      <div className="overflow-hidden rounded-4xl border border-(--color-border) bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-surface),white_12%)_0%,color-mix(in_oklab,var(--color-background),var(--color-accent-50)_24%)_100%)] p-(--space-xl) shadow-sm">
        <div className="space-y-(--space-xs)">
          <span className="inline-flex rounded-full border border-[color-mix(in_oklab,var(--color-accent-500),transparent_45%)] bg-[color-mix(in_oklab,var(--color-accent-100),white_40%)] px-(--space-sm) py-[0.35rem] text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent-text)">
            Catálogo
          </span>
          <h1 className="text-3xl font-bold leading-none text-(--color-text) sm:text-4xl">
            Cursos
          </h1>
          <p className="text-base leading-relaxed text-(--color-text-secondary)">
            Empieza ya con algunos cursos y accede a un catálogo claro, visual y preparado para seguir aprendiendo desde cualquier dispositivo.
          </p>
        </div>
      </div>

      <ul className="m-12 flex list-none flex-wrap gap-6 p-0">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ul>
    </section>
  );
};
