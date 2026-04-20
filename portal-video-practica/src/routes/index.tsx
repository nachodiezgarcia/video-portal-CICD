import { createFileRoute } from "@tanstack/react-router";
import { CoursesComponent } from "../pods/courses/courses.component";

export const Route = createFileRoute("/")({
  component: CoursesComponent,
});
