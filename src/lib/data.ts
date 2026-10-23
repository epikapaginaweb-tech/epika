import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { resolveSettings } from "./settings";
import { publicClient } from "./supabase/public";
import type { CourseWithTeacher, Faq, TeacherWithCourses, Testimonial } from "./types";

export const TAGS = {
  courses: "courses",
  teachers: "teachers",
  faqs: "faqs",
  testimonials: "testimonials",
  settings: "settings",
} as const;

const COURSE_SELECT = "*, teacher:teachers(*)";

export async function getCourses(): Promise<CourseWithTeacher[]> {
  "use cache";
  cacheTag(TAGS.courses, TAGS.teachers);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("courses")
    .select(COURSE_SELECT)
    .order("featured", { ascending: false })
    .order("sort")
    .order("created_at", { ascending: false });
  if (error) console.error("getCourses", error.message);
  return (data as CourseWithTeacher[] | null) ?? [];
}

export async function getCourse(slug: string): Promise<CourseWithTeacher | null> {
  "use cache";
  cacheTag(TAGS.courses, TAGS.teachers);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return null;
  const { data, error } = await db.from("courses").select(COURSE_SELECT).eq("slug", slug).maybeSingle();
  if (error) console.error("getCourse", error.message);
  return (data as CourseWithTeacher | null) ?? null;
}

export async function getTeachers(): Promise<TeacherWithCourses[]> {
  "use cache";
  cacheTag(TAGS.teachers, TAGS.courses);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("teachers")
    .select("*, courses(id, slug, title)")
    .order("sort")
    .order("name");
  if (error) console.error("getTeachers", error.message);
  return (data as TeacherWithCourses[] | null) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db.from("faqs").select("*").order("sort").order("created_at");
  if (error) console.error("getFaqs", error.message);
  return (data as Faq[] | null) ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(TAGS.testimonials);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db.from("testimonials").select("*").order("sort").order("created_at");
  if (error) console.error("getTestimonials", error.message);
  return (data as Testimonial[] | null) ?? [];
}

export async function getSettings() {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");
  const db = publicClient();
  if (!db) return resolveSettings(null);
  const { data, error } = await db.from("site_settings").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("getSettings", error.message);
  return resolveSettings(data?.data);
}
