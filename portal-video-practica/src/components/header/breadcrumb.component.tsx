import { Link, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { getCourse } from '../../pods/course-detail/course-detail.api'

export const Breadcrumb = () => {
  const matches = useRouterState({ select: s => s.matches })
  const params = (matches[matches.length - 1]?.params ?? {}) as {
    courseId?: string
    lessonIndex?: string
  }

  const { courseId, lessonIndex } = params

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId!),
    enabled: !!courseId,
  })

  const lessonName =
    course && lessonIndex !== undefined
      ? course.lecciones[Number(lessonIndex)]?.nombre
      : undefined

  return (
    <nav className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
      <Link
        to="/"
        aria-label="Inicio"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--color-border) bg-background text-(--color-text) transition-colors hover:bg-primary-50"
      >
        <Home size={16} />
      </Link>
      {course && (
        <>
          <span className="text-(--color-text-placeholder)">/</span>
          <Link
            to="/courses/$courseId"
            params={{ courseId: course.id }}
            className="max-w-40 truncate font-medium text-(--color-text) no-underline"
          >
            {course.nombre}
          </Link>
        </>
      )}
      {lessonName && (
        <>
          <span className="text-(--color-text-placeholder)">/</span>
          <span className="max-w-40 truncate">{lessonName}</span>
        </>
      )}
    </nav>
  )
}
