import { createFileRoute } from "@tanstack/react-router";
import { CourseDetailComponent } from "../../pods/course-detail/course-detail.component";

export const Route = createFileRoute("/courses/$courseId")({
  component: function CourseDetailPage() {
    const { courseId } = Route.useParams();
    return <CourseDetailComponent courseId={courseId} />;
  },
});
