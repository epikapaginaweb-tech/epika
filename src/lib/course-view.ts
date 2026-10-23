import type { CourseCardData } from "@/components/site/CourseCard";
import { MODALITY_LABEL, formatDate } from "./format";
import type { Course } from "./types";

export function courseMeta(course: Course) {
  const start = formatDate(course.start_date, { day: "numeric", month: "short" });
  return [start && `Inicia ${start}`, course.duration].filter(Boolean) as string[];
}

export function toCardData(course: Course): CourseCardData {
  return {
    slug: course.slug,
    title: course.title,
    image: course.image_url,
    modality: MODALITY_LABEL[course.modality],
    description: course.short_description,
    meta: courseMeta(course),
  };
}

export function upcoming<T extends Course>(courses: T[], today: string) {
  const dated = courses
    .filter((c) => c.start_date && c.start_date >= today)
    .sort((a, b) => (a.start_date ?? "").localeCompare(b.start_date ?? ""));
  return dated.length > 0 ? dated : courses;
}
