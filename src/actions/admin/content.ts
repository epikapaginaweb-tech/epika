"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { TAGS } from "@/lib/data";
import { slugify } from "@/lib/format";
import { resolveSettings } from "@/lib/settings";
import { serviceClient } from "@/lib/supabase/service";
import { CATEGORIES, MODALITIES, type CourseModule, type Pillar, type Stat } from "@/lib/types";
import { MEDIA_MAX_BYTES, MEDIA_TYPES, extensionFor } from "@/lib/uploads";

export type FormState = { error?: string; ok?: boolean };

function touch(tag: string) {
  updateTag(tag);
  revalidatePath("/admin", "layout");
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const nullable = (fd: FormData, key: string) => text(fd, key) || null;
const checked = (fd: FormData, key: string) => fd.get(key) === "on";
const lines = (fd: FormData, key: string) =>
  text(fd, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function json<T>(fd: FormData, key: string, fallback: T): T {
  try {
    return JSON.parse(text(fd, key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function number(fd: FormData, key: string) {
  const raw = text(fd, key).replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export async function requestMediaUpload(input: { folder: string; type: string; size: number }) {
  await requireAdmin();
  if (!MEDIA_TYPES.includes(input.type)) return { error: "Formato no permitido." };
  if (input.size > MEDIA_MAX_BYTES) return { error: "El archivo supera los 10 MB." };
  const folder = slugify(input.folder) || "general";
  const path = `${folder}/${randomUUID()}.${extensionFor(input.type)}`;
  const storage = serviceClient().storage.from("media");
  const { data, error } = await storage.createSignedUploadUrl(path);
  if (error || !data) return { error: "No se pudo preparar la carga." };
  return { path: data.path, uploadToken: data.token, publicUrl: storage.getPublicUrl(data.path).data.publicUrl };
}

export async function saveCourse(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(fd, "id");
  const title = text(fd, "title");
  if (!title) return { error: "El programa necesita un nombre." };
  const slug = slugify(text(fd, "slug") || title);
  if (!slug) return { error: "Revisa el enlace del programa." };
  const categoryRaw = text(fd, "category");
  const category = CATEGORIES.includes(categoryRaw as (typeof CATEGORIES)[number]) ? categoryRaw : "programa";
  const modality = text(fd, "modality");
  if (!MODALITIES.includes(modality as (typeof MODALITIES)[number])) return { error: "Elige una modalidad válida." };

  const modules = json<CourseModule[]>(fd, "modules", [])
    .map((m) => ({ title: String(m.title ?? "").trim(), description: String(m.description ?? "").trim() }))
    .filter((m) => m.title);

  const row = {
    title,
    slug,
    category,
    modality,
    image_url: nullable(fd, "image_url"),
    banner_url: nullable(fd, "banner_url"),
    short_description: nullable(fd, "short_description"),
    summary: nullable(fd, "summary"),
    objectives: lines(fd, "objectives"),
    audience: nullable(fd, "audience"),
    requirements: lines(fd, "requirements"),
    modules,
    teacher_id: nullable(fd, "teacher_id"),
    duration: nullable(fd, "duration"),
    schedule: nullable(fd, "schedule"),
    start_date: nullable(fd, "start_date"),
    end_date: nullable(fd, "end_date"),
    price: number(fd, "price"),
    currency: text(fd, "currency") || "USD",
    payment_methods: lines(fd, "payment_methods"),
    includes: lines(fd, "includes"),
    certificate: nullable(fd, "certificate"),
    brief_url: nullable(fd, "brief_url"),
    brief_public: checked(fd, "brief_public"),
    visible: checked(fd, "visible"),
    featured: checked(fd, "featured"),
    rating: Math.min(5, Math.max(0, number(fd, "rating") ?? 5)),
    show_ecuador: checked(fd, "show_ecuador"),
    coming_soon: checked(fd, "coming_soon"),
    price_credit: number(fd, "price_credit"),
    cash_note: nullable(fd, "cash_note"),
    credit_note: nullable(fd, "credit_note"),
    academic_hours: (() => {
      const hours = number(fd, "academic_hours");
      return hours === null ? null : Math.max(0, Math.trunc(hours));
    })(),
    sort: Math.trunc(number(fd, "sort") ?? 0),
  };

  const db = serviceClient().from("courses");
  const { error } = id ? await db.update(row).eq("id", id) : await db.insert(row);
  if (error) {
    if (error.code === "23505") return { error: "Ya existe un programa con ese enlace. Cambia el campo «Enlace»." };
    console.error("saveCourse", error.message);
    return { error: "No se pudo guardar el programa." };
  }

  touch(TAGS.courses);
  redirect("/admin/programas");
}

export async function setCourseVisibility(id: string, visible: boolean) {
  await requireAdmin();
  await serviceClient().from("courses").update({ visible }).eq("id", id);
  touch(TAGS.courses);
}

export async function deleteCourse(id: string) {
  await requireAdmin();
  await serviceClient().from("courses").delete().eq("id", id);
  touch(TAGS.courses);
}

export async function saveTeacher(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return { error: "Escribe el nombre del instructor." };

  const row = {
    name,
    photo_url: nullable(fd, "photo_url"),
    headline: nullable(fd, "headline"),
    specialty: nullable(fd, "specialty"),
    bio: nullable(fd, "bio"),
    experience: nullable(fd, "experience"),
    visible: checked(fd, "visible"),
    sort: Math.trunc(number(fd, "sort") ?? 0),
  };

  const db = serviceClient().from("teachers");
  const { error } = id ? await db.update(row).eq("id", id) : await db.insert(row);
  if (error) {
    console.error("saveTeacher", error.message);
    return { error: "No se pudo guardar el instructor." };
  }

  touch(TAGS.teachers);
  redirect("/admin/instructores");
}

export async function setTeacherVisibility(id: string, visible: boolean) {
  await requireAdmin();
  await serviceClient().from("teachers").update({ visible }).eq("id", id);
  touch(TAGS.teachers);
}

export async function deleteTeacher(id: string) {
  await requireAdmin();
  await serviceClient().from("teachers").delete().eq("id", id);
  touch(TAGS.teachers);
}

export async function saveFaq(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(fd, "id");
  const question = text(fd, "question");
  const answer = text(fd, "answer");
  if (!question || !answer) return { error: "Completa la pregunta y la respuesta." };

  const row = {
    question,
    answer,
    category: text(fd, "category") || "general",
    visible: checked(fd, "visible"),
    sort: Math.trunc(number(fd, "sort") ?? 0),
  };
  const db = serviceClient().from("faqs");
  const { error } = id ? await db.update(row).eq("id", id) : await db.insert(row);
  if (error) return { error: "No se pudo guardar la pregunta." };
  touch(TAGS.faqs);
  return { ok: true };
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await serviceClient().from("faqs").delete().eq("id", id);
  touch(TAGS.faqs);
}

export async function saveTestimonial(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(fd, "id");
  const name = text(fd, "name");
  const quote = text(fd, "quote");
  if (!name || !quote) return { error: "Completa el nombre y el testimonio." };

  const row = {
    name,
    quote,
    course: nullable(fd, "course"),
    course_id: nullable(fd, "course_id"),
    photo_url: nullable(fd, "photo_url"),
    authorized: checked(fd, "authorized"),
    visible: checked(fd, "visible"),
    sort: Math.trunc(number(fd, "sort") ?? 0),
  };
  const db = serviceClient().from("testimonials");
  const { error } = id ? await db.update(row).eq("id", id) : await db.insert(row);
  if (error) return { error: "No se pudo guardar el testimonio." };
  touch(TAGS.testimonials);
  return { ok: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await serviceClient().from("testimonials").delete().eq("id", id);
  touch(TAGS.testimonials);
}

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const mapEmbed = text(fd, "mapEmbed");
  const mapSrc = mapEmbed.match(/src="([^"]+)"/)?.[1] ?? mapEmbed;

  const settings = resolveSettings({
    whatsapp: text(fd, "whatsapp"),
    salesWhatsapp: text(fd, "salesWhatsapp"),
    campusUrl: text(fd, "campusUrl"),
    promoLabel: text(fd, "promoLabel") || "Promoción",
    promoText: text(fd, "promoText").slice(0, 120),
    countryCode: text(fd, "countryCode").replace(/\D/g, "") || "593",
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    address: text(fd, "address"),
    hours: text(fd, "hours"),
    mapEmbed: mapSrc,
    socials: {
      instagram: text(fd, "socials.instagram"),
      facebook: text(fd, "socials.facebook"),
      tiktok: text(fd, "socials.tiktok"),
      linkedin: text(fd, "socials.linkedin"),
      youtube: text(fd, "socials.youtube"),
    },
    bankAccounts: json(fd, "bankAccounts", []),
    paymentNote: text(fd, "paymentNote"),
    hero: {
      eyebrow: text(fd, "hero.eyebrow"),
      title: text(fd, "hero.title"),
      highlight: text(fd, "hero.highlight"),
      subtitle: text(fd, "hero.subtitle"),
    },
    benefits: json(fd, "benefits", []),
    stats: json<Stat[]>(fd, "stats", [])
      .map((s) => ({
        value: String(s.value ?? "").replace(/\D/g, "").slice(0, 9),
        prefix: String(s.prefix ?? "").trim().slice(0, 3),
        suffix: String(s.suffix ?? "").trim().slice(0, 6),
        label: String(s.label ?? "").trim().slice(0, 60),
      }))
      .filter((s) => s.value && s.label),
    about: {
      intro: text(fd, "about.intro"),
      history: text(fd, "about.history"),
      mission: text(fd, "about.mission"),
      vision: text(fd, "about.vision"),
      methodology: json(fd, "about.methodology", []),
      pillars: json<Pillar[]>(fd, "about.pillars", [])
        .map((p) => ({
          title: String(p.title ?? "").trim().slice(0, 120),
          objective: String(p.objective ?? "").trim().slice(0, 600),
          axes: String(p.axes ?? "").trim().slice(0, 900),
        }))
        .filter((p) => p.title),
      gallery: json<string[]>(fd, "about.gallery", []).filter((src) => typeof src === "string" && src.startsWith("https://")),
    },
    offer: {
      enabled: checked(fd, "offer.enabled"),
      programa: checked(fd, "offer.programa"),
      seminario: checked(fd, "offer.seminario"),
      otro: checked(fd, "offer.otro"),
      showComingSoon: checked(fd, "offer.showComingSoon"),
      comingSoonSlogan: text(fd, "offer.comingSoonSlogan"),
    },
    motto: text(fd, "motto").slice(0, 200),
    mottoText: text(fd, "mottoText").slice(0, 600),
    thanks: {
      title: text(fd, "thanks.title").slice(0, 80),
      text: text(fd, "thanks.text").slice(0, 1200),
    },
    privacy: text(fd, "privacy"),
    seoDescription: text(fd, "seoDescription"),
  });

  const { error } = await serviceClient()
    .from("site_settings")
    .upsert({ id: 1, data: settings, updated_at: new Date().toISOString() });
  if (error) {
    console.error("saveSettings", error.message);
    return { error: "No se pudo guardar el contenido." };
  }

  touch(TAGS.settings);
  return { ok: true };
}
