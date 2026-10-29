// Portada del brochure de cada programa. Se usa cuando el programa no tiene imagen propia en el panel.
const COVERS: Record<string, string> = {
  "community-manager-y-publicidad-digital": "/brand/cursos/community-manager-y-publicidad-digital.jpg",
  "trafficker-digital-pro": "/brand/cursos/trafficker-digital-pro.jpg",
  "inteligencia-artificial-para-marketing-y-ventas": "/brand/cursos/inteligencia-artificial-para-marketing-y-ventas.jpg",
  "seminario-meta-ads": "/brand/cursos/seminario-meta-ads.jpg",
};

export function courseCover(course: { slug: string; image_url: string | null }): string | null {
  return course.image_url || COVERS[course.slug] || null;
}
