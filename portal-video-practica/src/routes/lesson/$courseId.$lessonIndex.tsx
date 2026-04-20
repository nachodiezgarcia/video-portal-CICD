import { createFileRoute } from "@tanstack/react-router";
import { LessonDetailComponent } from "../../pods/lesson-detail/lesson-detail.component";

export const Route = createFileRoute("/lesson/$courseId/$lessonIndex")({
  component: function LessonDetailPage() {
    const { courseId, lessonIndex } = Route.useParams();
    return <LessonDetailComponent courseId={courseId} lessonIndex={Number(lessonIndex)} />;
  },
});
