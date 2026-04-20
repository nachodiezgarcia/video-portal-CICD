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

  if (loading) return <p className="text-[var(--color-text-secondary)]">Cargando cursos...</p>;
  if (error) return <p className="text-[var(--color-error)]">{error}</p>;

  return (
    <section>
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-1">Cursos</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">Empieza ya con algunos cursos</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 list-none p-0 m-0">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </ul>
    </section>
  );
};
