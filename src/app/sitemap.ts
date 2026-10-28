import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const pages = ["", "/nosotros", "/programas", "/contacto", "/reservar", "/privacidad"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.7 : 1 })),
    ...courses.map((course) => ({ url: `${SITE_URL}/programas/${course.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
