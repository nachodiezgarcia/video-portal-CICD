import { Link } from "@tanstack/react-router";
import type { Cursos } from "../../common/models/media.model";

interface Props {
  course: Cursos;
}

export const CourseCard = ({ course }: Props) => (
  <li className="border-2 border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] hover:shadow-md transition-shadow">
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="flex flex-col items-center p-4 no-underline"
    >
      <div className="w-full border border-[var(--color-border)] rounded overflow-hidden mb-4">
        <img
          src={course.imagen.url}
          alt={course.imagen.alt ?? course.nombre}
          className="w-full h-48 object-cover"
        />
      </div>
      <span className="text-[var(--color-text)] font-medium text-center border-b border-[var(--color-text)] pb-1 w-full">
        {course.nombre}
      </span>
    </Link>
  </li>
);
