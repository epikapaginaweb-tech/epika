// Portada del brochure de cada programa. Se usa cuando el programa no tiene imagen propia en el panel.
const COVERS: Record<string, string> = {
  "community-manager-y-publicidad-digital": "/brand/cursos/community-manager-y-publicidad-digital.jpg",
  "trafficker-digital-pro": "/brand/cursos/trafficker-digital-pro.jpg",
  "inteligencia-artificial-para-marketing-y-ventas": "/brand/cursos/inteligencia-artificial-para-marketing-y-ventas.jpg",
  "seminario-meta-ads": "/brand/cursos/seminario-meta-ads.jpg",
};

type CourseImages = { slug: string; image_url: string | null; banner_url?: string | null };

/** Imagen vertical (abanico del inicio): la vertical del panel, o la portada del brochure. */
export function courseCover(course: CourseImages): string | null {
  return course.image_url || COVERS[course.slug] || null;
}

/** Imagen horizontal (página del programa y catálogo): la horizontal del panel; si no hay, la vertical o la portada. */
export function courseBanner(course: CourseImages): string | null {
  return course.banner_url || course.image_url || COVERS[course.slug] || null;
}
