import { Link } from "@tanstack/react-router";
import type { Cursos } from "../../common/models/media.model";

interface Props {
  course: Cursos;
}

export const CourseCard = ({ course }: Props) => (
  <li className="list-none">
    <Link
      to="/courses/$courseId"
      params={{ courseId: course.id }}
      className="block w-62 no-underline"
    >
      <div className="flex flex-col items-center rounded-xl border-2 border-primary bg-surface p-(--space-sm) text-(--color-text)">
        <div className="mb-(--space-sm) w-full rounded-lg border-2 border-primary bg-surface p-2">
        <img
          src={course.imagen.url}
          alt={course.imagen.alt ?? course.nombre}
            className="h-36 w-full rounded-md object-cover"
        />
        </div>

        <p className="m-0 text-center text-base font-semibold text-(--color-text)">{course.nombre}</p>

        <hr className="mt-(--space-sm) w-full border-primary" />
      </div>
    </Link>
  </li>
);
